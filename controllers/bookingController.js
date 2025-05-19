const Booking = require("../models/Booking"); // Booking model
const Package = require("../models/Package"); // Package model
const User = require('../models/UserModel');
const mongoose = require("mongoose");


// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { name, email, phone, package: packageName, date, passengers, totalAmount, userId } = req.body;

    if (!name || !email || !phone || !packageName || !date || !passengers || !userId || passengers.length === 0) {
      return res.status(400).json({ message: "All fields including passengers are required." });
    }

    // Optional: Find the related package if needed
    const travelPackage = await Package.findOne({ name: packageName });
    if (!travelPackage) {
      return res.status(404).json({ message: "Selected package not found." });
    }

    const newBooking = new Booking({
      name,
      email,
      phone,
      package: travelPackage._id, // store ObjectId reference
      date,
      userId,
      passengers,
      totalAmount,
      status: "Pending", // default status
    });

    await newBooking.save();

    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create booking." });
  }
};


// GET /api/bookings/user/:userId - Get bookings by userId
exports.getBookingsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const bookings = await Booking.find({ userId });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user." });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user bookings." });
  }
};


// Update booking status (Confirm or Cancel)
exports.updateBookingStatus = async (req, res) => {
    try {
      const { status } = req.body; // status should be either "Confirmed" or "Cancelled"
      const booking = await Booking.findById(req.params.id);
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      booking.status = status; // Update the booking status
      await booking.save();
  
      res.status(200).json({ message: `Booking ${status}`, booking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update booking status." });
    }
  };


// GET /api/users/:id/dashboard
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("username email mobile");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookings = await Booking.find({ userId }).populate("package");

    const activeBookings = bookings.filter(b => b.status === "Confirmed").length;
    const tripsCompleted = bookings.filter(b => b.status === "Completed").length;
    const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const recentActivity = bookings
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(b => {
        const emoji = b.status === "Confirmed" ? "✅" :
                      b.status === "Pending" ? "⏳" :
                      b.status === "Completed" ? "🎉" : "📌";
        const packageName = b.package?.name || "a destination";
        return `${emoji} ${b.status} booking to ${packageName} - ${b.date.toISOString().slice(0, 10)}`;
      });

    res.json({
      email: user.email,
      username: user.username,
      mobile: user.mobile,
      activeBookings,
      tripsCompleted,
      totalSpent,
      recentActivity,
    });
    
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ message: "Failed to load dashboard data." });
  }
};

// Admin Dashboard: Aggregated Stats (Total Users, Bookings, Revenue, etc.)
exports.getAdminDashboard = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find();

    // Fetch all bookings and populate related package information
    const bookings = await Booking.find().populate('package');

    // Total number of users
    const totalUsers = users.length;

    // Total number of bookings
    const totalBookings = bookings.length;

    // Total revenue (sum of all totalAmount in bookings)
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

    // Active bookings (Confirmed bookings)
    const activeBookings = bookings.filter(booking => booking.status === 'Confirmed').length;

    // Completed trips (Completed bookings)
    const completedTrips = bookings.filter(booking => booking.status === 'Completed').length;

    // Active users (users with at least one confirmed booking)
    const activeUsers = users.filter(user => bookings.some(booking => booking.userId.toString() === user._id.toString() && booking.status === 'Confirmed')).length;

    // Respond with aggregated data
    res.json({
      totalUsers,
      totalBookings,
      totalRevenue,
      activeBookings,
      completedTrips,
      activeUsers
    });

  } catch (err) {
    console.error("Admin dashboard fetch error:", err);
    res.status(500).json({ message: "Failed to load admin dashboard data." });
  }
};

// Controller function to fetch all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find(); // No populate needed
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};