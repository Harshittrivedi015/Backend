const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// POST - Create a new booking
router.post("/bookings", bookingController.createBooking);
// GET - Fetch all bookings (Admin or Agent use)
router.get("/bookings", bookingController.getAllBookings);
// Admin route to get dashboard data
router.get('/admin/dashboard', bookingController.getAdminDashboard);


// GET - Fetch booking by ID
router.get("/bookings/:userId", bookingController.getBookingsByUserId);
// PUT - Update booking status (Confirm/Cancel)
router.put("/bookings/:id/status", bookingController.updateBookingStatus);
// GET - Dashboard data for user
router.get("/users/:id/dashboard", bookingController.getUserDashboard);


module.exports = router; 