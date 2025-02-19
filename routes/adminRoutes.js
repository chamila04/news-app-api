const express = require('express');
const router = express.Router();
const cors = require('cors');
const User = require('../models/User');

// Enable all CORS requests
router.use(cors());

// Get all editors
router.get('/editors', async (req, res) => {
  try {
    const editors = await User.find({ type: 'editor' })
      .select('-__v -email')
      .sort({ createdAt: -1 });
    res.json(editors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update editor status
router.patch('/:id/status', async (req, res) => {
  try {
    const editor = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).select('-__v -email');
    
    if (!editor) return res.status(404).json({ message: 'Editor not found' });
    res.json(editor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;