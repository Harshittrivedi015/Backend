const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://trivediharshit015:jdFNHYPdfFrXssV5@cluster0.v4ln6f7.mongodb.net/booking', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectDB;
