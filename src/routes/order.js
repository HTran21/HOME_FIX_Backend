const express = require("express");
const router = express.Router();
const orderController = require("../controller/OrderController");
const authenMiddleware = require("../middleware/authMiddleware");
const loginMiddleware = require("../middleware/loginMiddleware")

// router.get("/getoperation", operationController.getOperation);
router.get("/getAllOrder", authenMiddleware, orderController.getAllOrder);
router.post("/", loginMiddleware, orderController.createOrder);
router.get("/detail/:id", orderController.detailOrder);
router.get("/user/:id", orderController.getOrderUser)
router.put("/update/:id", orderController.updateOrder)
router.put("/denied/:id", orderController.deniedOrder)
router.post("/accept/:id", orderController.acceptOrder)
router.put("/editaccept/:id", orderController.updateRepairerScheduleOrder)
router.put("/acceptRepairer/:id", orderController.acceptOrderTimeSlot)
router.get("/fullDetail/:id", orderController.fullDetailOrder)
router.delete("/delete/:id", orderController.deleteOrder)
router.post("/taskRepair/:id", orderController.listTaskOrder)
router.get("/detailTaskRepair/:id", orderController.detailListTaskOrder)
router.put("/updateTaskRepair/:id", orderController.updateTaskOrder)
router.delete("/deleteTaskRepair/:id", orderController.deleteTaskOrder)
router.put("/updateStatusOrder/:id", orderController.updateStatusOrder)
router.get("/confirmOrder/:id", orderController.getConfirmOrder)

module.exports = router;