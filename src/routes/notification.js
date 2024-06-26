const express = require("express");
const router = express.Router();
const notificationController = require("../controller/NotificationController")

router.get("/userNotification", notificationController.getNotification);
router.post("/changeReadNotification", notificationController.changeReadNotification);

module.exports = router;