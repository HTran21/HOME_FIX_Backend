const express = require("express");
const router = express.Router();
const productController = require("../controller/ProductController")

router.get("/brand", productController.getBrand);
router.post("/brand", productController.createBrand);
router.get("/categories", productController.getCategories);
router.post("/categories", productController.createCategories);
router.delete("/brand/:id", productController.deleteBrand);
router.delete("/categories/:id", productController.deleteCategories);

module.exports = router;