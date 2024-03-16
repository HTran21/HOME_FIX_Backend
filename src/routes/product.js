const express = require("express");
const router = express.Router();
const productController = require("../controller/ProductController")

router.get("/brand", productController.getBrand)
router.post("/brand", productController.createBrand);
router.delete("/brand/:id", productController.deleteBrand);

module.exports = router;