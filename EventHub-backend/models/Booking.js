const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    default: '',
  },
  seatsBooked: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  ticketCode: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'attended'],
    default: 'confirmed',
  },
  notes: {
    type: String,
    default: '',
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
