const User = require("../models/user");
const passport = require("passport");
const mongoose = require("mongoose");
const randToken = require('rand-token');


// Define a function to extract the parameters for a new User object from the request body
const getUserParams = (body) => {
  return {
    name: body.name,
    email: body.email,
    password: body.password,
    role: body.role,
    graduationYear: body.graduationYear,
    major: body.major,
    job: body.job,
    company: body.company,
    city: body.city,
    state: body.state,
    country: body.country,
    zipCode: body.zipCode,
    bio: body.bio,
    interests: body.interests,
    apiToken: randToken.generate(16),
  };
};
module.exports = {
  // Render the index view with all users
  index: (req, res, next) => {
    User.find({})
      .then((users) => {
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },

  // Render the index view with all users
  indexView: (req, res) => {
    res.render("users/index");
  },

  // Render the new user form 
  new: (req, res) => {
    res.render("users/new");
  },

  // Create a new user
  create: (req, res, next) => {
    if (req.skip) return next();
    let newUser = new User(getUserParams(req.body));
    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash(
          "success",
          `${user.name}'s account created successfully!`
        );
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash(
          "error",
          `Failed to create user account because: ${error.message}.`
        );
        res.locals.redirect = "/users/new";
        next();
      }
    });
  },

  // redirect to the URL specified in res.locals.redirect , otherwise to the next middleware function.
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  // retrieve a user by ID and sets it as a local on the response object before passing to next middleware 
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.locals.user = user;

        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  // render the view for a single user
  showView: (req, res) => {
    res.render("users/show");
    
  },

  // Render the edit view for a single user
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.render("users/edit", {
          user: user,
        });
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  // Update a user by ID
  update: (req, res, next) => {
    let userId = req.params.id,
    userParams = getUserParams(req.body);

    User.findByIdAndUpdate(userId, {
      $set: userParams,
    })
      .then((user) => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },

  // Delete a user by ID
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },
  login: (req, res) => {
    res.render("users/login");
  },

  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
  }),
  validate: (req, res, next) => {
    req.sanitizeBody("email").trim();
    // req.sanitizeBody("email").normalizeEmail({
    //   all_lowercase: true,
    // });
    req.check("email", "Email is invalid").isEmail();
    req.check("password", "Password cannot be empty").notEmpty();
    req.check("zipCode", "Zip code can not be empty").notEmpty();
    req.check("zipCode", "Zip code should be numbers").isInt();
    req.check("zipCode", "Zip code should have 5 digits").isLength({
      min: 5,
      max: 5,
    });
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },
  
  logout: (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "You have been logged out!");
      res.locals.redirect = "/";
      next();
    });
  },

  // check if is login
  isLogin: (req, res, next)=>{
    if(res.locals.loggedIn){
      next();
    }else{
      req.flash("error","You need to login");
      res.redirect("/users/login");
    }
  },

  // get apiToken
  verifyToken: (req, res, next) => {
    let token = res.locals.currentUser.apiToken;
    if (token) {
      console.log(token)
      User.findOne({ apiToken: token })
        .then((user) => {
          console.log(user)
          if (user) next();
          else next(new Error("Invalid API token."));
        })
        .catch((error) => {
          next(new Error(error.message));
        });
    } else {
      next(new Error("Invalid API token."));
    }
  },
};

