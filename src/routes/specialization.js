const express = require("express");
const router = express.Router();
const specializationController = require("../controller/SpecializationController")

// router.get("/getoperation", operationController.getOperation);
router.get("/", specializationController.getSpecialize);
router.post("/", specializationController.addSpecialize);
router.delete("/:id", specializationController.deleteSpecialize);
router.put("/:id", specializationController.updateSpecialize);

module.exports = router;