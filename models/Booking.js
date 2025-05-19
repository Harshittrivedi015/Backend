const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema({
  name: String,
  gender: String,
  age: Number,
});

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  package: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: "Pending" },
  userId: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  passengers: [passengerSchema],
});

module.exports = mongoose.model("Booking", bookingSchema);
