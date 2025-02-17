require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const articleRoutes = require('./routes/articleRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Configure JSON payload limit
app.use(express.json({ limit: '50mb' }));

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', adminRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));