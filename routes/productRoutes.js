const express = require("express");
const { createProductController, getProductController, getSingleProduct, productPhotoController, deleteProductController, updateProductController, productFilterController, productCountController, productListController, searchProductController, relatedProductController, productCatagoryController, braintreeTokenController, braintreePaymentController } = require("../controllers/productController");
const { requireSighIn, isAdmin } = require("../middlewares/authMiddleware");
const formidable = require("express-formidable");

// Router Object
const router = express.Router();

// Routing
// Get All Products || GET
router.get("/get-product", getProductController);

// Get Single Product || GET
router.get("/get-product/:slug", getSingleProduct);

// Get Photo || GET
router.get("/product-photo/:pid", productPhotoController);

// Create Product || POST
router.post("/create-product", requireSighIn, isAdmin, formidable(), createProductController)

// Update Product || PUT
router.put("/update-product/:pid", requireSighIn, isAdmin, formidable(), updateProductController);

// Delete Product || DELETE
router.delete("/delete-product/:pid", deleteProductController);

// Filter Product || GET
router.post("/product-filters", productFilterController);

// Product Count || GET
router.get("/product-count", productCountController);

// Product list base on page || GET
router.get("/product-list/:page", productListController);

// Search Product || GET
router.get("/search/:keyword", searchProductController)

// Similar Product || GET
router.get("/related-product/:pid/:cid", relatedProductController);

// Catagory wise product || GET
router.get("/product-catagory/:slug", productCatagoryController)

// Payment routes || GET
// Token
router.get("/braintree/token", braintreeTokenController)

// Payment || POST
router.post("/braintree/payment", requireSighIn, braintreePaymentController);

module.exports = router;