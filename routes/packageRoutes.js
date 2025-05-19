const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Create package - Only agents/admins
router.post("/add_packages", protect, authorizeRoles("agent", "admin"), packageController.addPackage);

// Get all packages - Public or protected
router.get("/packages", packageController.getPackages);

// Get one package
router.get("/packages/:id", packageController.getPackagesById);

// Update - Only agents/admins
router.put("/update_package/:id", protect, authorizeRoles("agent", "admin"), packageController.updatePackage);

// Delete - Only admins
router.delete("/delete_package/:id", protect, authorizeRoles("admin"), packageController.deletePackage);

module.exports = router;
 