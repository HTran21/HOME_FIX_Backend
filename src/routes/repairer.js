const express = require("express");
const router = express.Router();
const repairerController = require("../controller/RepairerController")
const authenMiddleware = require("../middleware/authMiddleware");

// router.post("/", authenMiddleware, repairerController.createRepairer);
router.put("/update/:id", repairerController.updateRepairer)

module.exports = router;