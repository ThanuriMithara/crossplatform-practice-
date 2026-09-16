const express = require('express');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// Sample seed data for initial population
const sampleEvents = [
  {
    title: 'Global Tech Summit 2026',
    description: 'Join the world leading tech visionaries, engineers, and founders for a 2-day conference exploring Next-Gen AI, Cloud Architecture, and Quantum Computing.',
    category: 'Tech',
    date: '2026-10-18',
    time: '09:00 AM - 05:00 PM',
    location: 'Colombo, Sri Lanka',
    venue: 'BMICH Main Auditorium',
    price: 35,
    totalSeats: 300,
    availableSeats: 215,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    organizerName: 'TechVision International',
    featured: true,
  },
  {
    title: 'Echoes of Sunset Acoustic Festival',
    description: 'An enchanting evening of live indie-folk, acoustic melodies, and artisan food trucks by the beach. Experience unforgettable musical performances.',
    category: 'Music',
    date: '2026-10-25',
    time: '04:30 PM - 11:00 PM',
    location: 'Mount Lavinia, Sri Lanka',
    venue: 'Sunset Sands Pavilion',
    price: 20,
    totalSeats: 200,
    availableSeats: 82,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    organizerName: 'Harmonic Vibe Events',
    featured: true,
  },
  {
    title: 'Modern Abstract Art Expo',
    description: 'A curated gallery showcase featuring over 50 contemporary painters and sculptors from across South Asia. Free welcome drinks and artist meet-and-greets.',
    category: 'Arts',
    date: '2026-11-05',
    time: '10:00 AM - 08:00 PM',
    location: 'Colombo 07, Sri Lanka',
    venue: 'National Art Gallery',
    price: 15,
    totalSeats: 150,
    availableSeats: 120,
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    organizerName: 'Lumina Art Collective',
    featured: false,
  },
  {
    title: 'Premier League Fanfest & Screening',
    description: 'Giant 4K outdoor LED screens, live DJ sets, interactive penalty shootouts, and delicious street food stalls for the biggest matchday celebration.',
    category: 'Sports',
    date: '2026-11-12',
    time: '06:00 PM - 11:30 PM',
    location: 'Colombo, Sri Lanka',
    venue: 'CR&FC Grounds',
    price: 10,
    totalSeats: 500,
    availableSeats: 390,
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    organizerName: 'Island Sports Club',
    featured: true,
  },
  {
    title: 'Gourmet Street Food Fiesta',
    description: 'Taste your way through 40+ premier food stalls, craft mocktails, live masterclasses with celebrity chefs, and dessert heaven.',
    category: 'Food',
    date: '2026-11-20',
    time: '12:00 PM - 10:00 PM',
    location: 'Galle Face Green, Colombo',
    venue: 'Ocean Breeze Plaza',
    price: 8,
    totalSeats: 600,
    availableSeats: 480,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    organizerName: 'TasteLanka Festivals',
    featured: false,
  },
  {
    title: 'Startup Launchpad & Investor Pitch',
    description: 'Connect with top angel investors, venture capitalists, and innovative founders. Pitch your startup and gain high-value networking opportunities.',
    category: 'Business',
    date: '2026-12-02',
    time: '01:00 PM - 06:00 PM',
    location: 'Colombo, Sri Lanka',
    venue: 'Shangri-La Ballroom',
    price: 50,
    totalSeats: 120,
    availableSeats: 45,
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    organizerName: 'VentureSpark Asia',
    featured: false,
  },
  {
    title: 'React Native & Mobile Dev Bootcamp',
    description: 'Hands-on intensive workshop building production-ready mobile apps with Expo, TypeScript, animations, and clean architecture.',
    category: 'Education',
    date: '2026-12-10',
    time: '09:30 AM - 04:30 PM',
    location: 'Nugegoda, Sri Lanka',
    venue: 'CodeCraft Innovation Hub',
    price: 25,
    totalSeats: 60,
    availableSeats: 18,
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    organizerName: 'CodeCraft Academy',
    featured: true,
  }
];

// GET ALL EVENTS (Search, Category filter, Featured)
router.get('/', async (req, res) => {
  try {
    const { search, category, featured } = req.query;
    let query = { status: { $ne: 'cancelled' } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const events = await Event.find(query).sort({ date: 1, createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error('Fetch events error:', err);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// GET ORGANIZER'S EVENTS
router.get('/organizer/my-events', auth, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.userId }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error('Fetch organizer events error:', err);
    res.status(500).json({ message: 'Failed to fetch organizer events' });
  }
});

// GET SINGLE EVENT
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email phone avatar');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error('Fetch single event error:', err);
    res.status(500).json({ message: 'Failed to retrieve event' });
  }
});

// CREATE NEW EVENT (Organizer)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      venue,
      price,
      totalSeats,
      imageUrl,
      featured,
    } = req.body;

    if (!title || !description || !date || !time || !location || !venue || totalSeats === undefined || price === undefined) {
      return res.status(400).json({ message: 'Please fill in all required event details' });
    }

    const seats = parseInt(totalSeats, 10);
    const eventPrice = parseFloat(price);

    const newEvent = new Event({
      title: title.trim(),
      description: description.trim(),
      category: category || 'Other',
      date,
      time,
      location: location.trim(),
      venue: venue.trim(),
      price: isNaN(eventPrice) ? 0 : eventPrice,
      totalSeats: isNaN(seats) ? 50 : seats,
      availableSeats: isNaN(seats) ? 50 : seats,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
      organizer: req.userId,
      organizerName: req.user.name || 'Event Organizer',
      featured: !!featured,
    });

    await newEvent.save();
    res.status(201).json({ event: newEvent, message: 'Event created successfully!' });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// UPDATE EVENT
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check ownership
    if (event.organizer.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    const {
      title,
      description,
      category,
      date,
      time,
      location,
      venue,
      price,
      totalSeats,
      imageUrl,
      featured,
      status,
    } = req.body;

    if (title) event.title = title.trim();
    if (description) event.description = description.trim();
    if (category) event.category = category;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location.trim();
    if (venue) event.venue = venue.trim();
    if (price !== undefined) event.price = parseFloat(price);
    if (imageUrl) event.imageUrl = imageUrl;
    if (featured !== undefined) event.featured = featured;
    if (status) event.status = status;

    if (totalSeats !== undefined) {
      const newTotal = parseInt(totalSeats, 10);
      const bookedSeats = event.totalSeats - event.availableSeats;
      event.totalSeats = newTotal;
      event.availableSeats = Math.max(0, newTotal - bookedSeats);
    }

    await event.save();
    res.json({ event, message: 'Event updated successfully!' });
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// DELETE EVENT
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    await Booking.deleteMany({ event: req.params.id });

    res.json({ message: 'Event and associated bookings removed successfully' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

// SEED DEMO EVENTS
router.post('/seed', async (req, res) => {
  try {
    const count = await Event.countDocuments();
    if (count > 0 && !req.query.force) {
      return res.json({ message: `Database already contains ${count} events. Use ?force=true to reset.` });
    }

    if (req.query.force) {
      await Event.deleteMany({});
    }

    // Default organizer fallback
    let defaultOrganizerId = '660000000000000000000001';
    const seedEventsWithOrganizer = sampleEvents.map(e => ({
      ...e,
      organizer: defaultOrganizerId,
    }));

    const inserted = await Event.insertMany(seedEventsWithOrganizer);
    res.status(201).json({ message: `Successfully seeded ${inserted.length} demo events!`, events: inserted });
  } catch (err) {
    console.error('Seed events error:', err);
    res.status(500).json({ message: 'Failed to seed events' });
  }
});

module.exports = router;
