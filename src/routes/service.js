const express = require("express");
const router = express.Router();
const serviceController = require("../controller/ServiceController")

router.get("/getService", serviceController.getService);
router.get("/getService/:id", serviceController.getDetailService);
router.put("/updateService/:id", serviceController.updateService)
router.delete("/deletService/:id", serviceController.deleteBlogService)


module.exports = router;