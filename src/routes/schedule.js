const express = require("express");
const router = express.Router();
const scheduleController = require("../controller/ScheduleController");
const repairerMiddleware = require("../middleware/repairerMiddleware")

router.post("/create", repairerMiddleware, scheduleController.createSchedudle)

module.exports = router;