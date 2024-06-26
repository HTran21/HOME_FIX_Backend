const express = require("express");
const router = express.Router();
const serviceController = require("../controller/ServiceController")

router.get("/getService", serviceController.getService);
router.get("/getOperation", serviceController.getOperation);
router.get("/getAllOperation", serviceController.getAllServicesWithOperations);
router.post("/createOperation", serviceController.createOperation);
router.post("/updateOperation/:id", serviceController.updateOperation);
router.get("/getOperation/:id", serviceController.getDetailOperation);
router.get("/detail/:id", serviceController.getDetailService);
router.put("/update/:id", serviceController.updateService);
router.delete("/deletService/:id", serviceController.deleteBlogService);
router.delete("/deleteOperation/:id", serviceController.deleteOperation);


module.exports = router;