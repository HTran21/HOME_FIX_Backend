const express = require("express");
const router = express.Router();
const authenticationController = require("../controller/AuthenticationController");

router.get("/", authenticationController.test);
router.get("/getProfile", authenticationController.getProfile);
router.get("/logout", authenticationController.logout);
router.post("/register", authenticationController.register);
router.post("/staff/register", authenticationController.registerStaff);
router.post("/login", authenticationController.login);
router.post("/staff/login", authenticationController.loginStaff);

module.exports = router;