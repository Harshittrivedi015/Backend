const express = require("express");
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/protected', adminController.getAdminData);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/role', adminController.updateUserRole);

module.exports = router;