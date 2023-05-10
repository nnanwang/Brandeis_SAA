const router = require("express").Router();
const errorController = require("../controllers/errorController");
// Set up routes for errors
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

module.exports = router;