const Job = require("../models/job");

// check if user is authenticated, if not, redirect to login page
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You must be logged in to do that.');
  res.redirect('/users/login');
}

// Define a function to extract the parameters for a new Job object from the request body
const getJobParams = (body) => {
  return {
    title: body.title,
    company: body.company,
    location: body.location,
    description: body.description,
    requirements: body.requirements,
    salary: body.salary,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone,
    postDate: body.postDate,
    deadlineDate: body.deadlineDate,
    isActive: body.isActive,
  }
};

module.exports = {
  // Render the index view with all jobs
  index: (req, res, next) => {
    Job.find()
      .then((jobs) => {
        res.render("jobs/index", { jobs: jobs });
      })
      .catch((error) => {
        console.log(`Error fetching jobs: ${error.message}`);
        next(error);
      });
  },

  // Render the index view with all jobs
  indexView: (req, res) => {
    res.render("jobs/index");
  },

  // Render the new job form
  new: (req, res, next) => {
    res.render("jobs/new", { job: {} });
  },

  // Create a new job
  create: [isAuthenticated, (req, res, next) => {
    Job.create({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      description: req.body.description,
      requirements: req.body.requirements,
      salary: req.body.salary,
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      postDate: req.body.postDate,
      deadlineDate: req.body.deadlineDate,
      isActive: req.body.isActive,
      user: req.user._id // set the user field to the ID of the current user

    })
      .then((job) => {
        req.flash("success", "Job created successfully!");
        res.locals.job = job;
        res.locals.redirect = "/jobs";
        next();
      })
      .catch((error) => {
        console.log(`Error creating job: ${error.message}`);
        next(error);
      });
  }],

  // Redirect to the URL specified in res.locals.redirect or move to the next middleware
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  
  // Render the job show page
  show: (req, res, next) => {
    let jobId = req.params.id;
    Job.findById(jobId)
      .then((job) => {
        res.locals.job = job;
        res.render("jobs/show", { job });
      })
      .catch((error) => {
        console.log(`Error fetching job by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("jobs/show");
  },

    // Render the job edit form
  edit: (req, res, next) => {
    const jobId = req.params.id;
    Job.findById(jobId)
      .then((job) => {
        // check if the current user is the owner of the job
        if (job.user && job.user.toString() !== req.user._id.toString()) {
          req.flash("error", "You are not authorized to edit this job.");
          return res.redirect(`/jobs/${jobId}`);
        }
        res.render("jobs/edit", { job });
      })
      .catch((error) => {
        console.log(`Error fetching job by ID: ${error.message}`);
        next(error);
      });
  },

  // Edit the job with the specified ID
  update: (req, res, next) => {
    const jobId = req.params.id;
    Job.findByIdAndUpdate(jobId, { $set: getJobParams(req.body) })
      .then((job) => {
        // check if the current user is the owner of the job
        if (job && job.user && job.user.toString() !== req.user._id.toString()) {
          req.flash("error", "You are not authorized to edit this job.");
          return res.redirect(`/jobs/${jobId}`);
        }
        Job.findByIdAndUpdate(jobId, { $set: getJobParams(req.body) })
          .then((job) => {
            req.flash("success", "Job updated successfully!");
            res.locals.redirect = `/jobs/${jobId}`;
            res.locals.job = job;
            return next();
          })
          .catch((error) => {
            console.log(`Error updating job: ${error.message}`);
            next(error);
          });
      })
      .catch((error) => {
        console.log(`Error fetching job by ID: ${error.message}`);
        next(error);
      });
  },

  // Delete the job with the specified ID
  delete: (req, res, next) => {
    const jobId = req.params.id;
    Job.findById(jobId)
      .then((job) => {
        // check if the current user is the owner of the job
        if (job.user && job.user.toString() !== req.user._id.toString()) {
          req.flash("error", "You are not authorized to delete this job.");
          return res.redirect(`/jobs/${jobId}`);
        }
        Job.findByIdAndRemove(jobId)
          .then(() => {
            req.flash("success", "Job deleted successfully!");
            res.redirect("/jobs");
          })
          .catch((error) => {
            console.log(`Error deleting job: ${error.message}`);
            next(error);
          });
      })
      .catch((error) => {
        console.log(`Error fetching job by ID: ${error.message}`);
        next(error);
      });
  },
  
}
  
  
  
  
  
