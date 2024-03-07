const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const authMiddleware = require("../middleware/authMiddleware")

router.get("/getStaff", authMiddleware, userController.getStaff);

module.exports = router;