const { getAllReviews } = require("../models/reviewModel");

const getReviews = (req, res) => {
  try {
    const reviews = getAllReviews();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

module.exports = { getReviews };
