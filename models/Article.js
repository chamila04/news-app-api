const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  username: {
    type: String, // Changed from ObjectId to String
    required: [true, 'Username is required'],
    trim: true
  },  
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  img: {
    type: String,
    required: [true, 'Image is required']
  },
  article: {
    type: String,
    required: [true, 'Article content is required']
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'accept', 'reject']
  }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);