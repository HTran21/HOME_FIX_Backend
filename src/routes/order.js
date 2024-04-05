const express = require("express");
const router = express.Router();
const orderController = require("../controller/OrderController")

// router.get("/getoperation", operationController.getOperation);
router.post("/", orderController.createOrder);
router.get("/detail/:id", orderController.detailOrder);
router.get("/user/:id", orderController.getOrderUser)
router.put("/update/:id", orderController.updateOrder)
router.delete("/delete/:id", orderController.deleteOrder)

module.exports = router;