const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const authMiddleware = require("../middleware/authMiddleware")
const loginMiddleware = require("../middleware/loginMiddleware");

router.get("/getStaff", authMiddleware, userController.getStaff);
router.put("/update/:id", loginMiddleware, userController.updateProfile)

module.exports = router;