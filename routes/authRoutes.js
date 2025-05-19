const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// POST /api/signup
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/Users', authController.getAllUsers);
router.get('/user/:id', authController.getUserById);
router.post('/logout', authController.logout);
router.put('/updateProfile/:id', authController.updateProfile);


module.exports = router;