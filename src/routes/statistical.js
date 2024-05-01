const express = require("express");
const router = express.Router();
const statisticalController = require("../controller/StatisticalController");
const authMiddleware = require("../middleware/authMiddleware")
const loginMiddleware = require("../middleware/loginMiddleware");

router.get("/overview", statisticalController.overviewStatistical);
router.get("/earning", statisticalController.earningStatistical);
router.get("/earningSelect", statisticalController.earningStatisticalSelect)
router.get("/earningbyCategori", statisticalController.earningByCategori)
router.get("/order", statisticalController.orderStatistical)
router.get("/orderbyCategori", statisticalController.orderStatisticalByCategori)
router.get("/overviewJob", statisticalController.overviewJob)
router.get("/repairer", statisticalController.jobStatistical)
// router.put("/update/:id", loginMiddleware, userController.updateProfile)

module.exports = router;