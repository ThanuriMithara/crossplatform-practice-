export type UserRole = 'attendee' | 'organizer';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  avatar?: string;
}

export type EventCategory =
  | 'All'
  | 'Tech'
  | 'Music'
  | 'Arts'
  | 'Sports'
  | 'Food'
  | 'Business'
  | 'Education'
  | 'Other';

export interface EventItem {
  id?: string;
  _id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  venue: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  imageUrl: string;
  organizerName?: string;
  organizer?: string | User;
  featured?: boolean;
  status?: 'active' | 'cancelled' | 'completed';
  createdAt?: string;
}

export interface Booking {
  id?: string;
  _id: string;
  event: EventItem;
  user: string | User;
  userName: string;
  userEmail: string;
  userPhone?: string;
  seatsBooked: number;
  totalPrice: number;
  ticketCode: string;
  status: 'confirmed' | 'cancelled' | 'attended';
  notes?: string;
  bookingDate: string;
}
