const router = require("express").Router();
const homeController = require("../controllers/homeController");

// navigate to different pages
router.get('/', homeController.index);
router.get('/contact', homeController.contact);
router.get('/about', homeController.about);
router.get('/chat', homeController.chat);


module.exports = router;
