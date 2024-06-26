const express = require("express");
const router = express.Router();
const operationController = require("../controller/OperationController")

router.get("/getoperation", operationController.getOperation);
router.post("/create", operationController.createOperation);
router.get("/operationbycategori", operationController.operationByCategori);

module.exports = router;