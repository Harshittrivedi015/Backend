const fs = require("fs");
const path = require("path");

const reviewsFilePath = path.join(__dirname, "../data/reviews.json");

const getAllReviews = () => {
  const raw = fs.readFileSync(reviewsFilePath);
  return JSON.parse(raw);
};

module.exports = { getAllReviews };
