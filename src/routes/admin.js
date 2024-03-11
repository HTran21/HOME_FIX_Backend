const express = require("express");
const router = express.Router();
const adminController = require("../controller/AdminController");


router.post("/service", adminController.addService);

module.exports = router;