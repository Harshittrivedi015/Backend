const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: Number, required: true }, // in days
  rating: { type: Number, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  train: { type: String },
  cab: { type: String },
  hotel: { type: String },
  meal: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Package", packageSchema);
