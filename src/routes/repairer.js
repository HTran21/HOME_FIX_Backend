const express = require("express");
const router = express.Router();
const repairerController = require("../controller/RepairerController")
const authenMiddleware = require("../middleware/authMiddleware");

router.get("/profile/:id", repairerController.detailProfile)
// router.post("/", authenMiddleware, repairerController.createRepairer);
router.put("/update/:id", repairerController.updateRepairer)
router.get("/getAllRepairer", repairerController.getAllRepair);

module.exports = router;