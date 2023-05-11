const router = require("express").Router();
const usersController = require("../controllers/usersController");

// Set up routes for users
router.get("/", usersController.index, usersController.indexView);
router.get("/new", usersController.new);
router.post("/create", usersController.validate, usersController.create, usersController.redirectView);
router.get("/login", usersController.login);
router.post(
  "/login",
  usersController.authenticate,
  usersController.redirectView
);
router.get(
  "/logout",
  usersController.logout,
  usersController.redirectView
);
router.get("/:id", usersController.show, usersController.showView);
router.get("/:id/edit", usersController.isLogin, usersController.edit, usersController.redirectView);
router.put(
    "/:id/update",
    usersController.isLogin,
    usersController.update,
    usersController.redirectView
);
router.delete(
    "/:id/delete",
    usersController.isLogin,
    usersController.delete,
    usersController.redirectView
);

module.exports = router;