const express = require("express");
const { registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersControllers, getAllOrdersController, orderStatusController } = require("../controllers/authController");
const { requireSighIn, isAdmin } = require("../middlewares/authMiddleware");

// Router Object
const router = express.Router();

// Routing
// Register || POST
router.post("/register", registerController); 

// Login || POST
router.post("/login", loginController);

// Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

// Test || GET
router.get("/test", requireSighIn, isAdmin, testController);

// Protected User route auth
router.get("/user-auth", requireSighIn, (req, res) => {
    res.status(200).send({ ok:true });
});

// Protected Admin route auth
router.get("/admin-auth", requireSighIn, isAdmin, (req, res) => {
    res.status(200).send({ ok:true });
});

// Update Profile || PUT
router.put("/profile", requireSighIn, updateProfileController);

// Orders || GET
router.get("/orders", requireSighIn, getOrdersControllers)

// All orders handle by admin || GET
router.get("/all-orders", requireSighIn, isAdmin, getAllOrdersController)

//Order Status Update by Admin || PUT
router.put("/order-status/:orderId", requireSighIn, isAdmin, orderStatusController);

module.exports = router;