const express = require("express");
const router = express.Router();
const blogServiceController = require("../controller/BlogController")

router.get("/getService", blogServiceController.getService);

module.exports = router;