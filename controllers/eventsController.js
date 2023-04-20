const Event = require("../models/event");
const User = require("../models/user");

// Define a function to extract the parameters for a new Event object from the request body
const getEventParams = (body) => {
  return {
    title: body.title,
    description: body.description,
    location: body.location,
    startDate: body.startDate,
    endDate: body.endDate,
    isOnline: body.isOnline,
    registrationLink: body.registrationLink,
    organizer: body.organizer,
    attendees: [],
  };
};

// Define a function to retrieve all users
const getAllUsers = () => {
  return User.find({}).exec();
};

module.exports = {
  // Render the index view with all events
  index: (req, res, next) => {
    Event.find({})
      .populate("organizer")
      .populate("attendees")
      .then((events) => {
        res.render("events/index", { events: events }); // Pass events as a local variable
      })
      .catch((error) => {
        console.log(`Error fetching events: ${error.message}`);
        next(error);
      });
  },

  // Render the index view with all events
  indexView: (req, res) => {
    res.render("events/index");
  },

  // Render the new event form
  new: (req, res, next) => {
  //   getAllUsers().then((users) => {
  //     res.render('events/new', { users: users });
  //   });
  // },
    User.find({})
      .then(users => {
        res.render("events/new", { users: users });
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },

  // Create a new event
  create: (req, res, next) => {
    Event.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      isOnline: req.body.isOnline,
      registrationLink: req.body.registrationLink,
      organizer: req.body.organizer
    }).then(event => {
      req.flash("success", "Event created successfully!");
      // res.locals.redirect = `/events/${event._id}`;
      res.locals.redirect = '/events';
      res.locals.event = event;
      next();
    })
      .catch(error => {
      console.log(`Error creating event: ${error.message}`);
      next(error);
  });
},
  
  // Redirect to the specified path or call the next middleware function
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let eventId = req.params.id;
    Event.findById(eventId)
      .populate("organizer")
      .populate("attendees") // Populate attendees field with User objects
      .then((event) => {
        res.locals.event = event;
        res.render("events/show",{ event });
      })
      .catch((error) => {
        console.log(`Error fetching event by ID: ${error.message}`);
        next(error);
      });
  },
  
  // Render the show view for a specific event
  showView: (req, res) => {
    res.render("events/show");
  },

  // Add an attendee to an event
  attend: (req, res, next) => {
    // if (!req.isAuthenticated()) {
    //   req.flash("error", "You must log in to attend events.");
    //   res.redirect("/users/login");
    //   return;
    // }

    const eventId = req.params.id;
    const attendeeEmail = req.body.email;
    
    User.findOne({ email: attendeeEmail })
      .then(user => {
        // check if user exists, if not, redirect to new user page
        if (user) {
          return Event.findByIdAndUpdate(eventId, {
            $push: { attendees: user._id }
          });
        } else {
          req.flash("error", "You need to create a user account first.");
          res.locals.redirect = "/users/new";
          next();
        }
      })
      .then(() => {
        req.flash("success", "Registered successfully!");
        res.locals.redirect = `/events/${eventId}`;
        next();
      });
    },
  
  // Render the edit view for a specific event
  edit: (req, res, next) => {
    const eventId = req.params.id;
  
    Event.findById(eventId)
      .populate("organizer")
      .then(event => {
        User.find()
          .then(users => {
            res.render("events/edit", {
              event: event,
              users: users,
              title: "Edit Event"
            });
          })
          .catch(error => {
            console.log(`Error fetching users: ${error.message}`);
            next(error);
          });
      })
      .catch(error => {
        console.log(`Error fetching event by ID: ${error.message}`);
        next(error);
      });
  },

  // Edit an event
  update: (req, res, next) => {
    let eventId = req.params.id,
      eventParams = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        isOnline: req.body.isOnline,
        registrationLink: req.body.registrationLink,
        organizer: req.body.organizer,
        attendees: req.body.attendees ? req.body.attendees : []
      };
    
    Event.findByIdAndUpdate(eventId, {
      $set: eventParams,
    })
      .then((event) => {
        res.locals.redirect = `/events/${eventId}`;
        res.locals.event = event;
        return User.findById(event.organizer);
      })
      .then((user) => {
          res.locals.event.organizer = user;
          req.flash("success", "Event updated successfully!");
          next();   
      })
      .catch((error) => {
        console.log(`Error updating event by ID: ${error.message}`);
        next(error);
      });
  },
  
  // Delete an event
  delete: (req, res, next) => {
    let eventId = req.params.id;
    Event.findByIdAndRemove(eventId)
      .then(() => {
        req.flash("success", "Event deleted successfully!");
        res.redirect("/events");
      })
      .catch((error) => {
        console.log(`Error deleting event by ID: ${error.message}`);
        next(error);
      });
},
};