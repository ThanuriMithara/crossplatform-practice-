const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper to generate a nice ticket code (e.g. EVT-9482-TX)
const generateTicketCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EH-${Date.now().toString().slice(-4)}-${randomStr}`;
};

// CREATE A BOOKING
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, seats, userName, userEmail, userPhone, notes } = req.body;

    if (!eventId || !seats || seats < 1) {
      return res.status(400).json({ message: 'Valid event and number of seats are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const requestedSeats = parseInt(seats, 10);
    if (event.availableSeats < requestedSeats) {
      return res.status(400).json({
        message: `Only ${event.availableSeats} seat(s) available. Cannot book ${requestedSeats} seat(s).`,
      });
    }

    const totalPrice = event.price * requestedSeats;
    const ticketCode = generateTicketCode();

    const booking = new Booking({
      event: event._id,
      user: req.userId,
      userName: userName || req.user.name,
      userEmail: userEmail || req.user.email,
      userPhone: userPhone || req.user.phone || '',
      seatsBooked: requestedSeats,
      totalPrice,
      ticketCode,
      notes: notes || '',
      status: 'confirmed',
    });

    await booking.save();

    // Deduct seats from event
    event.availableSeats = Math.max(0, event.availableSeats - requestedSeats);
    await event.save();

    const populatedBooking = await Booking.findById(booking._id).populate('event');

    res.status(201).json({
      booking: populatedBooking,
      message: '🎉 Booking confirmed successfully! Your tickets are ready.',
    });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ message: 'Failed to process booking' });
  }
});

// GET USER'S BOOKINGS
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate('event')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (err) {
    console.error('Fetch my bookings error:', err);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// CANCEL A BOOKING
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'This booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Refund available seats back to the event
    const event = await Event.findById(booking.event);
    if (event) {
      event.availableSeats = Math.min(event.totalSeats, event.availableSeats + booking.seatsBooked);
      await event.save();
    }

    const updatedBooking = await Booking.findById(booking._id).populate('event');
    res.json({
      booking: updatedBooking,
      message: 'Booking has been cancelled and seats restored.',
    });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

// GET ATTENDEES FOR AN ORGANIZER'S EVENT
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check organizer authorization
    if (event.organizer.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view attendee details for this event' });
    }

    const bookings = await Booking.find({ event: req.params.eventId })
      .populate('user', 'name email phone avatar')
      .sort({ bookingDate: -1 });

    const totalTicketsSold = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.seatsBooked, 0);

    const totalRevenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    res.json({
      event,
      bookings,
      stats: {
        totalTicketsSold,
        totalRevenue,
        totalBookings: bookings.length,
      },
    });
  } catch (err) {
    console.error('Fetch event attendees error:', err);
    res.status(500).json({ message: 'Failed to fetch event attendees' });
  }
});

module.exports = router;
