const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  type: {
    type: String,
    required: [true, 'User type is required'],
    enum: ['reporter', 'editor']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  status: {
    type: String,
    default: 'null'
  }
}, { timestamps: true });

// Set default status based on type
userSchema.pre('save', function (next) {
  if (this.isModified('type')) {
    if (this.type === 'reporter') {
      this.status = 'null';
    } else if (this.type === 'editor') {
      this.status = 'pending';
    }
  }
  // Hash password before saving
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      this.password = hashedPassword;
      next();
    });
  } else {
    next();
  }
});

module.exports = mongoose.model('User', userSchema);
