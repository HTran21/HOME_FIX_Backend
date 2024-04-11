const express = require("express");
const router = express.Router();
const productController = require("../controller/ProductController")

router.get("/", productController.getProduct);
router.post("/", productController.createProduct);
router.get("/brand", productController.getBrand);
router.post("/brand", productController.createBrand);
router.put("/brand/:id", productController.updateBrand);
router.get("/categories", productController.getCategories);
router.post("/categories", productController.createCategories);
router.delete("/brand/:id", productController.deleteBrand);
router.delete("/categories/:id", productController.deleteCategories);
router.get("/detail/:id", productController.getDetailProduct);
router.put("/detail/:id", productController.updateProduct);
router.get("/categories/:id", productController.getCategoriesService);
router.put("/categories/:id", productController.updateCategoriesService);


module.exports = router;