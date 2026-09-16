require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');
const Event = require('./models/Event');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'EventHub REST API',
    version: '1.0.0',
    endpoints: ['/api/auth', '/api/events', '/api/bookings'],
  });
});

// Database connection & auto-seed
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected successfully to EventHub database');
    try {
      const eventCount = await Event.countDocuments();
      if (eventCount === 0) {
        console.log('🌱 No events found in DB. Auto-seeding initial events...');
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
            organizer: new mongoose.Types.ObjectId('660000000000000000000001'),
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
            organizer: new mongoose.Types.ObjectId('660000000000000000000001'),
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
            organizer: new mongoose.Types.ObjectId('660000000000000000000001'),
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
            organizer: new mongoose.Types.ObjectId('660000000000000000000001'),
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
            organizer: new mongoose.Types.ObjectId('660000000000000000000001'),
            featured: false,
          },
        ];
        await Event.insertMany(sampleEvents);
        console.log('🌱 Seeded default events into database');
      }
    } catch (seedErr) {
      console.warn('Seed warning:', seedErr.message);
    }
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 EventHub API Server running on port ${PORT}`));