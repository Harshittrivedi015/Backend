const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const User = require('../models/UserModel');

// ✅ GET /api/admin/protected - Admin-only route (for testing access)
exports.getAdminData = [
  protect,
  authorizeRoles('admin'),
  (req, res) => {
    res.json({ message: "Admin data", data: "This is protected content." });
  }
];

// ✅ GET /api/admin/users - Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('username email mobile role');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

// ✅ DELETE /api/admin/users/:id - Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// ✅ PUT /api/admin/users/:id/role - Update user role
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ message: 'Role is required' });

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
};
