# 🎟️ EventHub — Modern Cross-Platform Event Discovery & Booking App

EventHub is a production-grade cross-platform mobile application and REST API backend built using **React Native (Expo SDK 57)** and **Node.js / Express with MongoDB Atlas**. It allows users to discover exciting events, book tickets with instant digital pass generation, view live seat availability, manage bookings, and host events as organizers with attendee tracking.

---

## ✨ Features Breakdown

### 📱 1. Client Mobile Application (React Native + Expo)
- **🎨 Premium Modern Design System**: Sleek dark obsidian palette (`#0B0F19`), vibrant indigo & violet accents (`#6366F1`), gradient buttons, pill filters, badges, and responsive card layouts.
- **🔐 Complete Authentication**:
  - Sign In & Sign Up with email format and password strength validation.
  - Role-based registration: **Attendee** vs **Organizer**.
  - One-tap quick demo login buttons for rapid testing and grading.
  - Persistent session storage using `@react-native-async-storage/async-storage`.
- **🧭 Discovery & Browse**:
  - Horizontal search bar with instant query matching across titles, venues, and descriptions.
  - Category pill filter selector (Music, Tech, Arts, Sports, Food, Business, Education).
  - 🔥 **Featured Highlights** carousel for curated events.
  - Pull-to-refresh feed with real-time seat availability indicator.
- **📄 Immersive Event Details**:
  - Hero image with floating back and native share controls.
  - Date, time, venue, and full description breakdown.
  - Real-time seat capacity progress bar and verified organizer profile.
- **🎫 Event Booking Flow**:
  - Interactive seat counter (`+` / `-`) with dynamic price calculations.
  - Attendee details collection with input validation.
  - **Digital Ticket Pass** generation with unique ticket code (`EH-XXXX-XXXX`), QR graphic, and perforated ticket layout.
- **🎟️ My Bookings**:
  - Filter by tabs: **Upcoming**, **All**, **Cancelled**.
  - Interactive cancellation with confirmation alert and instant seat refund.
- **👑 Organizer Dashboard & Management**:
  - Analytics summary cards: Total Events Hosted, Tickets Sold, Estimated Revenue.
  - **Create / Publish Event Form**: Title, Category, Date/Time, Venue, Location, Price, Capacity, Cover Photo presets, and Featured highlight toggle.
  - **Edit Event**: Update pricing, schedule, capacity, and details.
  - **Delete Event**: Permanent deletion with associated bookings cleanup.
  - **Attendee Roster**: View registered guests, contact info, seats booked, ticket codes, and revenue for any event.
- **👤 Profile & Settings**:
  - User avatar, name, email, phone, and bio.
  - Edit Profile modal dialog.
  - Instant **Role Switcher** (toggle between Attendee and Organizer mode without logging out).
  - Notification and reminder preference switches.

### 🌐 2. REST API Backend (Node.js + Express + MongoDB Atlas)
- **Authentication**: JWT token issuance, bcrypt password hashing, auth middleware.
- **Event Endpoints**:
  - `GET /api/events` — Filter by `?search=`, `?category=`, and `?featured=`.
  - `GET /api/events/:id` — Single event lookup with organizer populate.
  - `POST /api/events` — Create event (protected).
  - `PUT /api/events/:id` — Update event (owner protected).
  - `DELETE /api/events/:id` — Delete event (owner protected).
  - `GET /api/events/organizer/my-events` — Fetch organizer's events.
  - `POST /api/events/seed` — Seed demo events if database is empty.
- **Booking Endpoints**:
  - `POST /api/bookings` — Validates seat capacity, decrements available seats, generates ticket code, creates booking.
  - `GET /api/bookings/my-bookings` — Returns user's bookings with populated event info.
  - `PUT /api/bookings/:id/cancel` — Cancels booking and restores available seats to event.
  - `GET /api/bookings/event/:eventId` — Returns attendee list and revenue stats for an organizer's event.

---

## 🏗️ Project Structure

```
EventHub/
├── assets/                    # Static assets & icons
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── CategoryChips.tsx  # Category pill selector
│   │   ├── CustomButton.tsx   # Stylized buttons & variants
│   │   ├── CustomInput.tsx    # Inputs with validation & password toggle
│   │   ├── EmptyState.tsx     # Empty state placeholder
│   │   ├── EventCard.tsx      # Discovery event card
│   │   └── TicketPassCard.tsx # Digital pass card with perforated styling
│   ├── constants/
│   │   └── theme.ts           # Color palette, spacing, typography tokens
│   ├── context/
│   │   └── AuthContext.tsx    # Global auth & session management
│   ├── models/
│   │   └── types.ts           # TypeScript interfaces & types
│   ├── navigation/
│   │   └── AppNavigator.tsx   # Tab & Native Stack navigation
│   ├── screens/               # Mobile screens
│   │   ├── AddEditEventScreen.tsx
│   │   ├── BookingScreen.tsx
│   │   ├── BookingSuccessScreen.tsx
│   │   ├── EventAttendeesScreen.tsx
│   │   ├── EventDetailsScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── MyBookingsScreen.tsx
│   │   ├── OrganizerDashboardScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SignupScreen.tsx
│   └── services/
│       └── api.ts             # Axios API service + offline fallback store
├── EventHub-backend/
│   ├── middleware/
│   │   └── auth.js            # JWT auth middleware
│   ├── models/
│   │   ├── Booking.js         # MongoDB Booking schema
│   │   ├── Event.js           # MongoDB Event schema
│   │   └── User.js            # MongoDB User schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── bookings.js        # Ticket booking routes
│   │   └── events.js          # Event discovery & CRUD routes
│   ├── .env                   # Environment variables (MongoDB URI & JWT Secret)
│   ├── package.json           # Backend dependencies
│   └── server.js              # Express server entry point
├── App.tsx                    # Root App component with providers
├── package.json               # Frontend dependencies & scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **npm** or **yarn**
- **Expo Go** app on your physical mobile device, or Android Studio / Xcode emulator.

---

### 2. Backend Setup & Run

1. Navigate to the backend directory:
   ```bash
   cd EventHub-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure `.env` (already configured with MongoDB Atlas):
   ```env
   MONGO_URI=mongodb+srv://thanurimithara_db_user:Mummy%26Daddy%40123@cluster0.li0o1dk.mongodb.net/eventhub?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=eventhub_super_secret_key_change_this
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   # or with hot-reload:
   npm run dev
   ```
   The backend server will run on `http://localhost:5000` (or `http://YOUR_LOCAL_IP:5000`).

---

### 3. Frontend (Mobile App) Setup & Run

1. Navigate to the project root:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Running on Device / Simulator**:
   - **Physical Device**: Scan the QR code using the **Expo Go** app (Android) or Camera app (iOS).
   - **Android Emulator**: Press `a` in the terminal.
   - **iOS Simulator**: Press `i` in the terminal.
   - **Web Browser**: Press `w` in the terminal.

---

## 🧪 Testing Verification Checklist

| Phase | Feature | Status |
| :--- | :--- | :---: |
| **Phase 1** | Project Skeleton, Tab & Stack Navigation | ✅ Passed |
| **Phase 2** | User Sign Up, Login, Profile, AsyncStorage Persistence | ✅ Passed |
| **Phase 3** | Event Discovery, Search Query, Category Pills, Featured Carousel | ✅ Passed |
| **Phase 4** | Event Details Screen, Venue/Location Info, Seat Indicators | ✅ Passed |
| **Phase 5** | Ticket Booking Flow, Seat Counter, Dynamic Pricing, Success Pass | ✅ Passed |
| **Phase 6** | My Bookings Screen, Status Tabs, Cancel Ticket Action | ✅ Passed |
| **Phase 7** | Organizer Dashboard, Add Event, Edit Event, Delete Event, Attendees Roster | ✅ Passed |
| **Phase 8** | Rich Obsidian Theme, Custom Components, Responsive Layouts | ✅ Passed |
| **Phase 9** | MongoDB Models, Express REST API Routes, Error Handling | ✅ Passed |
| **Phase 10** | TypeScript Type Check (`npx tsc --noEmit`), Git Submission | ✅ Passed |

---

## 👨‍💻 License & Author
Developed as part of the **Cross-Platform Mobile Application Development** curriculum.
Licensed under the [MIT License](LICENSE).
