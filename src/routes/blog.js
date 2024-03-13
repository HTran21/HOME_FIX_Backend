const express = require("express");
const router = express.Router();
const blogServiceController = require("../controller/BlogController")

router.get("/getService", blogServiceController.getService);
router.get("/getService/:id", blogServiceController.getDetailService);
router.put("/updateService/:id", blogServiceController.updateService)
router.delete("/deletService/:id", blogServiceController.deleteBlogService)


module.exports = router;