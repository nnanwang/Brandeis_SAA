const router = require("express").Router();
// set up routes for users

const userRoutes = require("./userRoutes"),
    eventRoutes = require("./eventRoutes"),
    jobRoutes = require("./jobRoutes"),
    homeRoutes = require("./homeRoutes"),
    errorRoutes = require("./errorRoutes"),
    apiRoutes = require("./apiRoutes");

router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/jobs", jobRoutes);
router.use("/", homeRoutes);
router.use("/api", apiRoutes);
router.use("/error", errorRoutes);

module.exports = router;