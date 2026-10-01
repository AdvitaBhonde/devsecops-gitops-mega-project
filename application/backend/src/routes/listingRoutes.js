const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// GET /api/listings - Retrieve all travel listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving listings', error: error.message });
  }
});

// GET /api/listings/:id - Get single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving listing', error: error.message });
  }
});

// POST /api/listings - Create listing
router.post('/', async (req, res) => {
  try {
    const { title, description, location, country, price, category, imageUrl, featured } = req.body;
    if (!title || !location || price === undefined) {
      return res.status(400).json({ success: false, message: 'Title, location, and price are required' });
    }

    const listing = await Listing.create({
      title,
      description,
      location,
      country: country || 'Global',
      price: Number(price),
      category: category || 'Trending',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      featured: Boolean(featured)
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create listing', error: error.message });
  }
});

// PUT /api/listings/:id - Update listing
router.put('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update listing', error: error.message });
  }
});

// DELETE /api/listings/:id - Delete listing
router.delete('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.json({ success: true, message: 'Listing deleted successfully', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete listing', error: error.message });
  }
});

module.exports = router;
