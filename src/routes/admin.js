const express = require("express");
const router = express.Router();
const adminController = require("../controller/AdminController");

router.get("/getAll", adminController.getAllUser);
router.post("/repairer", adminController.createRepairer)
router.put("/repairer/:id", adminController.updateRepairer)
router.post("/service", adminController.addService);
router.delete("/repairer/delete/:id", adminController.deleteUser);

module.exports = router;