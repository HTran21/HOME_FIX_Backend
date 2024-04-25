const express = require("express");
const router = express.Router();
const feedbackController = require("../controller/FeedbackController")

router.get("/getAll", feedbackController.getAllFeedback);
router.get("/getByUser", feedbackController.getByUser);
router.post("/", feedbackController.createFeedback);

module.exports = router;