const express = require("express");
const { createCatagoryController, updateCatagoryController, catagoryController, singleCatagoryController, deleteCatagoryController } = require("../controllers/catagoryController");
const { requireSighIn, isAdmin } = require("../middlewares/authMiddleware");

// Router Object
const router = express.Router();

// Routing
// Get All Catagory || GET
router.get("/get-catagory", catagoryController);

// Get Single Catagory || GET
router.get("/single-catagory/:slug", singleCatagoryController)

// Create Catagory || POST
router.post("/create-catagory", requireSighIn, isAdmin, createCatagoryController)

// Update Catagory || PUT
router.put("/update-catagory/:id", requireSighIn, isAdmin, updateCatagoryController)

// Delete Catagory || DELETE
router.delete("/delete-catagory/:id", requireSighIn, isAdmin, deleteCatagoryController);

module.exports = router;