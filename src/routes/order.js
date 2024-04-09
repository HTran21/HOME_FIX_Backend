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
router.delete("/delete/:id", orderController.deleteOrder)

module.exports = router;