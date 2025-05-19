const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Agent-only route
exports.createPackage = [
  protect, // Ensure user is authenticated
  authorizeRoles('agent', 'admin'), // Allow agent and admin to create packages
  (req, res) => {
    // Logic to create a package
    res.json({ message: "Package created successfully" });
  }
];
