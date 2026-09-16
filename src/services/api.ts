import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, EventItem, User } from '../models/types';

// Default development IP - can be adjusted or overridden via AsyncStorage
export const API_BASE_URL = 'http://172.21.157.155:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach authorization token
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@eventhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn('Error reading token from storage:', error);
  }
  return config;
});

// Sample local fallback data in case backend is offline or network changes
export const INITIAL_MOCK_EVENTS: EventItem[] = [
  {
    _id: 'evt-101',
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
    status: 'active',
  },
  {
    _id: 'evt-102',
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
    status: 'active',
  },
  {
    _id: 'evt-103',
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
    status: 'active',
  },
  {
    _id: 'evt-104',
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
    status: 'active',
  },
  {
    _id: 'evt-105',
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
    status: 'active',
  },
  {
    _id: 'evt-106',
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
    status: 'active',
  },
  {
    _id: 'evt-107',
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
    status: 'active',
  },
];

// In-memory mock store for offline resilience
let localEventsStore = [...INITIAL_MOCK_EVENTS];
let localBookingsStore: Booking[] = [
  {
    _id: 'bk-901',
    event: INITIAL_MOCK_EVENTS[0],
    user: 'usr-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userPhone: '+94 77 123 4567',
    seatsBooked: 2,
    totalPrice: 70,
    ticketCode: 'EH-2026-9A8X',
    status: 'confirmed',
    bookingDate: new Date().toISOString(),
  },
];

// Helper to check stored offline items
const getOfflineEvents = async () => {
  try {
    const saved = await AsyncStorage.getItem('@eventhub_mock_events');
    if (saved) {
      localEventsStore = JSON.parse(saved);
    }
  } catch (e) {
    // fallback to memory
  }
  return localEventsStore;
};

const saveOfflineEvents = async (events: EventItem[]) => {
  localEventsStore = events;
  try {
    await AsyncStorage.setItem('@eventhub_mock_events', JSON.stringify(events));
  } catch (e) {
    // ignore
  }
};

const getOfflineBookings = async () => {
  try {
    const saved = await AsyncStorage.getItem('@eventhub_mock_bookings');
    if (saved) {
      localBookingsStore = JSON.parse(saved);
    }
  } catch (e) {
    // fallback
  }
  return localBookingsStore;
};

const saveOfflineBookings = async (bookings: Booking[]) => {
  localBookingsStore = bookings;
  try {
    await AsyncStorage.setItem('@eventhub_mock_bookings', JSON.stringify(bookings));
  } catch (e) {
    // ignore
  }
};

// API Services
export const eventService = {
  async getEvents(params?: { search?: string; category?: string; featured?: boolean }): Promise<EventItem[]> {
    try {
      const response = await api.get('/events', { params });
      if (Array.isArray(response.data) && response.data.length > 0) {
        saveOfflineEvents(response.data);
        return response.data;
      }
    } catch (err) {
      console.log('Backend unreachable, using responsive local mock data');
    }

    // Offline Filter
    let events = await getOfflineEvents();
    if (params?.search) {
      const s = params.search.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(s) ||
          e.description.toLowerCase().includes(s) ||
          e.location.toLowerCase().includes(s) ||
          e.venue.toLowerCase().includes(s)
      );
    }
    if (params?.category && params.category !== 'All') {
      events = events.filter((e) => e.category === params.category);
    }
    if (params?.featured) {
      events = events.filter((e) => e.featured);
    }
    return events;
  },

  async getEventById(id: string): Promise<EventItem> {
    try {
      const response = await api.get(`/events/${id}`);
      if (response.data) return response.data;
    } catch (err) {
      console.log('Using local event details');
    }
    const events = await getOfflineEvents();
    const found = events.find((e) => e._id === id || e.id === id);
    if (!found) throw new Error('Event not found');
    return found;
  },

  async createEvent(eventData: Partial<EventItem>): Promise<EventItem> {
    try {
      const response = await api.post('/events', eventData);
      if (response.data?.event) return response.data.event;
    } catch (err) {
      console.log('Saving event locally');
    }
    const newEvent: EventItem = {
      _id: `evt-${Date.now()}`,
      title: eventData.title || 'Untitled Event',
      description: eventData.description || '',
      category: eventData.category || 'Tech',
      date: eventData.date || new Date().toISOString().split('T')[0],
      time: eventData.time || '06:00 PM',
      location: eventData.location || 'Colombo, Sri Lanka',
      venue: eventData.venue || 'Main Hall',
      price: Number(eventData.price) || 0,
      totalSeats: Number(eventData.totalSeats) || 100,
      availableSeats: Number(eventData.totalSeats) || 100,
      imageUrl:
        eventData.imageUrl ||
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
      organizerName: eventData.organizerName || 'Me (Organizer)',
      featured: !!eventData.featured,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    const current = await getOfflineEvents();
    const updated = [newEvent, ...current];
    await saveOfflineEvents(updated);
    return newEvent;
  },

  async updateEvent(id: string, eventData: Partial<EventItem>): Promise<EventItem> {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      if (response.data?.event) return response.data.event;
    } catch (err) {
      console.log('Updating event locally');
    }
    const current = await getOfflineEvents();
    const updated = current.map((e) => (e._id === id ? { ...e, ...eventData } : e));
    await saveOfflineEvents(updated);
    return updated.find((e) => e._id === id)!;
  },

  async deleteEvent(id: string): Promise<void> {
    try {
      await api.delete(`/events/${id}`);
    } catch (err) {
      console.log('Deleting event locally');
    }
    const current = await getOfflineEvents();
    const filtered = current.filter((e) => e._id !== id);
    await saveOfflineEvents(filtered);
  },

  async getMyOrganizedEvents(): Promise<EventItem[]> {
    try {
      const response = await api.get('/events/organizer/my-events');
      if (Array.isArray(response.data)) return response.data;
    } catch (err) {
      console.log('Using local organized events');
    }
    const events = await getOfflineEvents();
    return events;
  },
};

export const bookingService = {
  async createBooking(data: {
    eventId: string;
    seats: number;
    userName?: string;
    userEmail?: string;
    userPhone?: string;
    notes?: string;
  }): Promise<Booking> {
    try {
      const response = await api.post('/bookings', data);
      if (response.data?.booking) return response.data.booking;
    } catch (err) {
      console.log('Booking created in local mode');
    }
    const events = await getOfflineEvents();
    const event = events.find((e) => e._id === data.eventId);
    if (!event) throw new Error('Event not found');

    if (event.availableSeats < data.seats) {
      throw new Error(`Only ${event.availableSeats} seats available.`);
    }

    event.availableSeats = Math.max(0, event.availableSeats - data.seats);
    await saveOfflineEvents([...events]);

    const newBooking: Booking = {
      _id: `bk-${Date.now()}`,
      event,
      user: 'usr-current',
      userName: data.userName || 'Attendee',
      userEmail: data.userEmail || 'attendee@example.com',
      userPhone: data.userPhone || '+94 77 000 0000',
      seatsBooked: data.seats,
      totalPrice: event.price * data.seats,
      ticketCode: `EH-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      status: 'confirmed',
      notes: data.notes || '',
      bookingDate: new Date().toISOString(),
    };

    const currentBookings = await getOfflineBookings();
    const updated = [newBooking, ...currentBookings];
    await saveOfflineBookings(updated);
    return newBooking;
  },

  async getMyBookings(): Promise<Booking[]> {
    try {
      const response = await api.get('/bookings/my-bookings');
      if (Array.isArray(response.data)) return response.data;
    } catch (err) {
      console.log('Using local bookings');
    }
    return await getOfflineBookings();
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      if (response.data?.booking) return response.data.booking;
    } catch (err) {
      console.log('Cancelled booking locally');
    }
    const current = await getOfflineBookings();
    let updatedBooking: Booking | null = null;
    const updated = current.map((b) => {
      if (b._id === bookingId) {
        updatedBooking = { ...b, status: 'cancelled' as const };
        return updatedBooking;
      }
      return b;
    });

    if (updatedBooking) {
      // Restore seats
      const events = await getOfflineEvents();
      const eventId = (updatedBooking as Booking).event._id;
      const event = events.find((e) => e._id === eventId);
      if (event) {
        event.availableSeats = Math.min(event.totalSeats, event.availableSeats + (updatedBooking as Booking).seatsBooked);
        await saveOfflineEvents([...events]);
      }
    }

    await saveOfflineBookings(updated);
    return updatedBooking!;
  },

  async getEventAttendees(eventId: string) {
    try {
      const response = await api.get(`/bookings/event/${eventId}`);
      if (response.data) return response.data;
    } catch (err) {
      console.log('Calculating local attendees');
    }
    const bookings = await getOfflineBookings();
    const eventBookings = bookings.filter((b) => b.event._id === eventId);
    const confirmed = eventBookings.filter((b) => b.status === 'confirmed');
    return {
      bookings: eventBookings,
      stats: {
        totalTicketsSold: confirmed.reduce((sum, b) => sum + b.seatsBooked, 0),
        totalRevenue: confirmed.reduce((sum, b) => sum + b.totalPrice, 0),
        totalBookings: eventBookings.length,
      },
    };
  },
};

export default api;