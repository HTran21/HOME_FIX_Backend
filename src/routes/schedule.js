const express = require("express");
const router = express.Router();
const scheduleController = require("../controller/ScheduleController");
const repairerMiddleware = require("../middleware/repairerMiddleware");
const authenMiddleware = require("../middleware/authMiddleware");

router.get("/allDayWork", authenMiddleware, scheduleController.getAllSchedule)
router.post("/create", repairerMiddleware, scheduleController.createSchedule)
router.get("/dayWork/:id", repairerMiddleware, scheduleController.listWorkDay);
router.get("/dayWorkService/:id", authenMiddleware, scheduleController.getDayWorkService)
router.get("/timeslot/:id", authenMiddleware, scheduleController.getTimeSlot)
router.get("/workRepair/:id", repairerMiddleware, scheduleController.getWorkRepairer)
module.exports = router;