const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+?\d{10,15}$/, 'Please enter a valid mobile number.']
  },
  address: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  profileImage: {
    data: Buffer,
    contentType: String
  },
  role: {
    type: String,
    enum: ['user', 'admin','agent'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogout: {  // Add this field
    type: Date
  }
}, {
  timestamps: true
});

// Static method to log the logout event (update lastLogout field)
userSchema.statics.logLogout = async function (userId) {
  return this.findByIdAndUpdate(userId, { lastLogout: new Date() });
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
