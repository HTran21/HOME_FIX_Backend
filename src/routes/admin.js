const express = require("express");
const router = express.Router();
const adminController = require("../controller/AdminController");

router.get("/getAll", adminController.getAllUser);
router.get("/getCustomer", adminController.getAllCustomer);
router.post("/repairer", adminController.createRepairer)
router.put("/repairer/:id", adminController.updateRepairer)
router.put("/customer/:id", adminController.updateCustomer)
router.delete("/customer/:id", adminController.deleteCustomer)
router.post("/service", adminController.addService);
router.delete("/repairer/delete/:id", adminController.deleteUser);

module.exports = router;