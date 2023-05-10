const router = require("express").Router();
const jobsController = require("../controllers/jobsController");
const usersController = require("../controllers/usersController");

// Set up routes for jobs
router.get("/", jobsController.index);
router.get("/new", usersController.isLogin, jobsController.new);
router.post("/create", usersController.isLogin, jobsController.create, jobsController.redirectView);
router.get("/:id", jobsController.show, jobsController.showView);
router.get("/:id/edit", usersController.isLogin, jobsController.edit);
router.put("/:id", usersController.isLogin, jobsController.update, jobsController.redirectView);
router.delete("/:id", usersController.isLogin, jobsController.delete, jobsController.redirectView);

module.exports = router;