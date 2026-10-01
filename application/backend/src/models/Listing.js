const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price must be positive']
    },
    category: {
      type: String,
      enum: ['Beach', 'Mountains', 'Trending', 'Cities', 'Camping', 'Luxury'],
      default: 'Trending'
    },
    featured: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Listing', ListingSchema);
