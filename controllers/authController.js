const User = require('../models/UserModel');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jwt = require('jsonwebtoken');
const multer = require('multer');


// Setup multer storage options
const storage = multer.memoryStorage();  // Use memory storage to store image as buffer
const upload = multer({ storage }).single('profileImage');  // 'profileImage' is the key

// sign up 

exports.signup = async (req, res) => {
    try {
      const { username, email, password, mobile, role } = req.body;
      // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or Username already exists' });
    }
      const user = new User({
        username,
        email,
        password,
        mobile,
        role
      });
  
      await user.save();
  
      res.json({ message: 'User registered successfully', user})

    } 
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
      }
 }


 // Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the password (since we're storing it in plain text, just check directly)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload includes user ID and role
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: '1d' } // Token expiration time (1 day)
    );

    // Return the token and user info
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
      
      
// all user find
      exports.getAllUsers = async function(req, res) {
        try {
          const users = await User.find(); // You can add filters here if needed
      
          res.json({
            message: "Users fetched successfully",
            users: users
          });
        } catch (err) {
          res.status(500).json({ message: "Server error", error: err.message });
        }
      };

 // all user find
      exports.getUserById = async function(req, res) {
        try {
          const userId = req.params.id;
          const users = await User.findById(userId); // You can add filters here if needed
      
          res.json({
            message: "Users fetched successfully",
            users: users
          });
        } catch (err) {
          res.status(500).json({ message: "Server error", error: err.message });
        }
      };


      exports.logout = async (req, res) => {
        try {
          const userId = req.body.userId;  // Extract userId from request body
          
          // Log the logout event by updating the lastLogout field
          await User.logLogout(userId);
          
          res.status(200).json({ message: 'Logged out successfully' });
        } catch (err) {
          console.error("Logout error:", err);
          res.status(500).json({ message: 'Logout failed' });
        }
      };
    

// Update Profile Controller
exports.updateProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }

    try {
      const userId = req.params.id;
      const updatedData = req.body;

      // If there's an image, store it as a Buffer in the database
      if (req.file) {
        updatedData.profileImage = req.file.buffer;  // Store the image buffer
      }

      // Update user profile
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};