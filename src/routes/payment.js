const express = require("express");
const router = express.Router();
const paymentController = require("../controller/PaymentController");
const userController = require("../controller/UserController")

router.post("/vnpay/create_payment_url", userController.handleBooking, paymentController.handleCreatePaymentVnpayUrl);
router.get("/vnpay/vnpay_return", paymentController.vnpayReturn);

module.exports = router;