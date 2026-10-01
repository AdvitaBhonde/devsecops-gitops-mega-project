const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const healthRoutes = require('./routes/healthRoutes');
const taskRoutes = require('./routes/taskRoutes');
const listingRoutes = require('./routes/listingRoutes');
const Listing = require('./models/Listing');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devsecops-db';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/tasks', listingRoutes); // Backward compatibility alias

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Wanderlust Travel Platform API',
    endpoints: {
      health: '/health',
      listings: '/api/listings',
      tasks: '/api/tasks'
    }
  });
});

// Seed default travel listings if DB is empty
const seedSampleListings = async () => {
  try {
    const count = await Listing.countDocuments();
    if (count === 0) {
      console.log('[Wanderlust] Seeding initial travel destinations...');
      await Listing.insertMany([
        {
          title: 'Cozy Beachfront Cottage',
          description: 'Relax to the sound of waves in this serene luxury oceanfront cottage with panoramic sunrise views.',
          location: 'Goa',
          country: 'India',
          price: 4500,
          category: 'Beach',
          featured: true,
          imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Alpine Mountain Chalet',
          description: 'A cozy timber chalet tucked in the snow-capped Himalayan peaks. Perfect for trekking enthusiasts.',
          location: 'Manali',
          country: 'India',
          price: 6200,
          category: 'Mountains',
          featured: true,
          imageUrl: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Modern Penthouse Suite',
          description: 'Skyline view luxury apartment located right in the heart of downtown with private rooftop infinity pool.',
          location: 'Mumbai',
          country: 'India',
          price: 9800,
          category: 'Cities',
          featured: false,
          imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
        }
      ]);
      console.log('[Wanderlust] Sample destinations seeded successfully!');
    }
  } catch (err) {
    console.error('[Wanderlust] Error seeding listings:', err.message);
  }
};

// Connect to MongoDB & Start Server
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected successfully to ${MONGODB_URI}`);
    await seedSampleListings();
  } catch (err) {
    console.error(`[MongoDB] Connection error: ${err.message}`);
    console.log('[MongoDB] Running in fallback mode');
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Wanderlust Backend running on port ${PORT}`);
  });
});

module.exports = app;
