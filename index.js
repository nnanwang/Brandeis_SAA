const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const layouts = require("express-ejs-layouts");
const connectFlash = require("connect-flash");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const expressValidator = require("express-validator");
const passport = require("passport");
const User = require("./models/user");
const router = require("./routes/index");
const socketio = require("socket.io");
const chatController = require("./controllers/chatController");

// Create a new express app and router
const app = express();
// Set up static files directory
app.use(express.static("public"));

// Connect to MongoDB database
mongoose.connect("mongodb://localhost:27017/recipe_db");
const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to mongodb!");
});

// Set up middleware
app.use(express.json());
app.use(express.urlencoded());
app.enable('verbose errors');
//It serves static files
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(layouts);
app.use(expressValidator()); 

// Set up method override middleware for handling DELETE and PUT requests
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

// Set up cookie parser and express session middleware for handling sessions
app.use(cookieParser("secret-pascode"));
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 40000, 
    },
    resave: false,
    saveUninitialized: false,
  })
);
// Set up connect-flash middleware for handling flash messages
app.use(connectFlash());
app.use(express.static(__dirname + '/public'));
app.use("/js", express.static(__dirname + "/public/js", { "Content-Type": "application/javascript" }));

// Set up passport middleware for authentication
app.use(passport.initialize());
app.use(passport.session());
// Configure passport to use the User model for authentication

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up middleware for handling flash messages, checking if user is logged in, and setting currentUser
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

// Set up root route
app.use("/", router);

// Set up port and server
const server = app.listen(8080, () => {
  console.log("application is running");
});

//pass server to sockerio
const io = socketio(server);
//pass io to chatController
chatController(io);