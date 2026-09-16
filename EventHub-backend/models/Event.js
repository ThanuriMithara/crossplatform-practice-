const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Music', 'Tech', 'Arts', 'Sports', 'Food', 'Business', 'Education', 'Other'],
    default: 'Tech',
  },
  date: {
    type: String, // e.g. "2026-10-15"
    required: true,
  },
  time: {
    type: String, // e.g. "06:00 PM"
    required: true,
  },
  location: {
    type: String, // e.g. "Colombo, Sri Lanka"
    required: true,
  },
  venue: {
    type: String, // e.g. "BMICH Main Auditorium"
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1,
    default: 100,
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0,
    default: 100,
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80',
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  organizerName: {
    type: String,
    default: 'Event Organizer',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
