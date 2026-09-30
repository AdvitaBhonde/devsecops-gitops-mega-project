const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const healthRoutes = require('./routes/healthRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devsecops-db';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRoutes);
app.use('/api/tasks', taskRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to DevOps Task Manager API',
    endpoints: {
      health: '/health',
      tasks: '/api/tasks'
    }
  });
});

// Connect to MongoDB & Start Server
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected successfully to ${MONGODB_URI}`);
  } catch (err) {
    console.error(`[MongoDB] Connection error: ${err.message}`);
    console.log('[MongoDB] Running in fallback mode');
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] DevSecOps Backend running on port ${PORT}`);
  });
});

module.exports = app;
