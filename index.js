const mongoose = require("mongoose");
const express = require("express");
const homeController = require('./controllers/homeController');
const usersController = require("./controllers/usersController");
const methodOverride = require("method-override");
const layouts = require("express-ejs-layouts");
const connectFlash = require("connect-flash");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const expressValidator = require("express-validator");
const passport = require("passport");
const User = require("./models/user");
const eventsController = require('./controllers/eventsController');
const jobsController = require("./controllers/jobsController");
const { body, validationResult } = require('express-validator');

// Create a new express app and router
const app = express();
const router = express.Router();
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
app.set("view engine", "ejs");
app.use(layouts);
app.use(expressValidator()); 
app.use(methodOverride('_method'));

// Set up method override middleware for handling DELETE and PUT requests
router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

// Set up cookie parser and express session middleware for handling sessions

router.use(cookieParser("secret_passcode"));
router.use(
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
router.use(connectFlash());
// Set up passport middleware for authentication
router.use(passport.initialize());
router.use(passport.session());
// Configure passport to use the User model for authentication
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up middleware for handling flash messages, checking if user is logged in, and setting currentUser
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

// Set up root route
app.use("/", router);
app.get("/", (req, res) => {
  res.render("layout.ejs");
});

// navigate to different pages
router.get('/', homeController.getHomePage);
router.get('/about', homeController.getAboutPage);
router.get('/contact', homeController.getContactPage);

// Set up routes for users
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.validate, usersController.create, usersController.redirectView);
router.get("/users/login", usersController.login);
router.post(
  "/users/login",
  usersController.authenticate,
  usersController.redirectView
);
router.get(
  "/users/logout",
  usersController.logout,
  usersController.redirectView
);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put(
  "/users/:id/update",
  usersController.update,
  usersController.redirectView
);
router.delete(
  "/users/:id/delete",
  usersController.delete,
  usersController.redirectView
);

// Set up routes for events
router.get("/events", eventsController.index);
router.get("/events/new", eventsController.new);
router.post("/events/create", eventsController.create, eventsController.redirectView);
router.get("/events/:id", eventsController.show, eventsController.showView);
router.get("/events/:id/edit", eventsController.edit);
// Update event in the database
router.put("/events/:id", eventsController.update, eventsController.redirectView);
router.delete("/events/:id/delete", eventsController.delete, eventsController.redirectView);
router.post("/events/:id/attend", eventsController.attend, eventsController.redirectView);

// Set up routes for jobs
router.get("/jobs", jobsController.index);
router.get("/jobs/new", jobsController.new);
router.post("/jobs/create", jobsController.create, jobsController.redirectView);
router.get("/jobs/:id", jobsController.show, jobsController.showView);
router.get("/jobs/:id/edit", jobsController.edit);
router.put("/jobs/:id", jobsController.update, jobsController.redirectView);
router.delete("/jobs/:id", jobsController.delete, jobsController.redirectView);

module.exports = router;

app.listen(8080, () => {
  console.log("application is running at 8080!");
});
