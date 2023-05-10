const Event = require("../models/event");
const User = require("../models/user");
const httpStatus = require("http-status-codes");


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
    // organizer: body.organizer,
    // attendees: [],
  };
};

module.exports = {
  // Render the index view with all events
  index: (req, res, next) => {
    Event.find({})
      .populate("organizer")
      .then((events) => {
        res.locals.events = events;
        next();
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

  validate: (req, res, next) => {
    // Validate the fields in the request body
    req.check("title", "title cannot be empty").notEmpty();
    req.check("location", "location can not be empty").notEmpty();
    req.check("description", "description can not be empty").notEmpty();

    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/events/new";
        next();
      } else {
        next();
      }
    });
  },

  // Render the new event form
  new: (req, res, next) => {
    res.render("events/new");
    // User.find({})
    //   .then(users => {
    //     res.render("events/new", { users: users });
    //   })
    //   .catch(error => {
    //     console.log(`Error fetching users: ${error.message}`);
    //     next(error);
    //   });
  },

  // Create a new event
  create: (req, res, next) => {
    let eventParams = getEventParams(req.body);
    eventParams.organizer = res.locals.currentUser._id;

    Event.create(eventParams).then(event => {
      req.flash("success", "Event created successfully!");
      // res.locals.redirect = `/events/${event._id}`;
      res.locals.redirect = '/events';
      res.locals.event = event;
      next();
    })
      .catch(error => {
      console.log(`Error creating event: ${error.message}`);
      next();
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
      .populate("attendees")
      .exec()
      .then((event) => {
        res.locals.event = event;
        next();
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

  // register to attend event
  attend: (req, res, next) => {
    let eventId = req.params.id;
    Event.findByIdAndUpdate(eventId, {
      $addToSet: { attendees: res.locals.currentUser._id },
      },
    ).then((event) => {
      req.flash(
        "success",
        `${event.title} registered successfully!`
      );
      res.locals.redirect = `/events`;
      next();
    })
    .catch((error) => {
      console.log(`Error : ${error.message}`);
      next(error);
    });
  },
  
  // Render the edit view for a specific event
  edit: (req, res, next) => {
    let eventId = req.params.id;
    Event.findById(eventId)
      .then((event) => {
        res.render("events/edit", {
          event: event,
        });
      })
      .catch((error) => {
        console.log(`Error fetching event by ID: ${error.message}`);
        next(error);
      });
  },

  // Edit an event
  update: (req, res, next) => {
    let eventId = req.params.id,
      eventParams = getEventParams(req.body);
    
    Event.findByIdAndUpdate(eventId, {
      $set: eventParams,
    })
    .then((event) => {
      req.flash(
        "success",
        `${event.title}'s event updated successfully!`
      );
      res.locals.redirect = `/events/${eventId}`;
      res.locals.event = event;
      next();
    })
    .catch((error) => {
      console.log(`Error updating event by ID: ${error.message}`);
      next(error);
    });
  },
  
  // Delete an event
  delete:  (req, res, next) => {
    let eventId = req.params.id;
    Event.findByIdAndRemove(eventId)
      .then((event) => {
        req.flash(
          "success",
          `${event.title} deleted successfully!`
        );
        res.locals.redirect = "/events";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting event by ID: ${error.message}`);
        next();
      });
  },

  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals,
    });
  },
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error.",
      };
    }
    res.json(errorObject);
  },
  join: (req, res, next) => {
    let eventId = req.params.id,
      currentUser = res.locals.currentUser;
    if (currentUser) {
      Event.findByIdAndUpdate(eventId, {
        $addToSet: { attendees: res.locals.currentUser._id },
        },)
        .then(() => {
          res.locals.success = true;
          req.flash('success', 'You have successfully joined the event!');
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next(new Error("User must log in."));
    }
  },
};