const router = require("express").Router();
const eventsController = require("../controllers/eventsController");
const usersController = require("../controllers/usersController"); // import the users controller module

// Set up routes for events
router.get("/", eventsController.index, eventsController.indexView);
router.get("/new", usersController.isLogin, eventsController.new);
router.post("/create", usersController.isLogin, eventsController.create, eventsController.redirectView);
router.get("/:id", eventsController.show, eventsController.showView);
router.get("/:id/edit", usersController.isLogin, eventsController.edit);
// Update event in the database
router.put("/:id", usersController.isLogin, eventsController.update, eventsController.redirectView);
router.delete("/:id/delete", usersController.isLogin, eventsController.delete, eventsController.redirectView);
router.post("/:id/attend", usersController.isLogin, eventsController.attend, eventsController.redirectView);

module.exports = router;
