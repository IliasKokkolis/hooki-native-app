# Hooki - Location-Based Dating App

Hooki is a mobile dating app that allows users to match and chat with people who are in the same shop, café, or bar. The app uses location-based matching to help users connect with others nearby.

## Tech Stack

### Frontend
- **React Native** with Expo (cross-platform for iOS & Android)
- **React Native Paper** for UI components
- **React Navigation** for navigation
- **Supabase** for authentication
- **Socket.IO Client** for real-time messaging
- **Expo Location** for location services
- **Expo Image Picker** for photo uploads
- **Expo Notifications** for push notifications

### Backend
- **Node.js** with Express
- **Socket.IO** for real-time features (chat, live updates)
- **In-memory storage** (no database for MVP - ready to migrate to database)

## Features

### MVP Features Implemented

1. **User Onboarding**
   - Sign up with email/password
   - Social login support (via Supabase)
   - Basic profile setup (name, age, avatar, bio)

2. **User Profile Management**
   - Edit profile information
   - Upload avatar/photos
   - Manage interests and bio

3. **Matching Mechanics**
   - Feed view with hooks/posts from nearby users
   - Like and reply to hooks
   - Location-based filtering

4. **Messaging System**
   - 1-on-1 private chat
   - Real-time messaging with Socket.IO
   - Message history

5. **Core Feed**
   - View hooks from users in the same location
   - See replies and interactions
   - Create new hooks

6. **Safety Essentials**
   - Report users
   - Block users
   - Privacy controls

7. **Push Notifications**
   - Infrastructure set up for likes, replies, matches
   - Expo Notifications integration

8. **Location-Based Matching**
   - Find users in the same venue
   - Filter by distance
   - Show venue names when available

## Project Structure

```
Hooki2/
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── screens/       # Screen components
│   │   ├── context/       # React Context (Auth, Socket)
│   │   └── services/      # API and service functions
│   ├── App.js             # Main app component
│   ├── app.json           # Expo configuration
│   └── package.json       # Mobile dependencies
├── server/                # Node.js backend
│   ├── index.js          # Express server with Socket.IO
│   └── .env.example      # Environment variables template
├── package.json          # Root package.json
└── README.md            # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account (for authentication)
- For mobile development: Expo Go app on your phone or iOS Simulator/Android Emulator

### Backend Setup

1. Navigate to the project root:
```bash
cd Hooki2
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server/` directory (copy from `.env.example`):
```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Mobile App Setup

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `mobile/` directory:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** For physical devices, replace `localhost` with your computer's IP address (e.g., `http://192.168.1.100:3000`)

4. Start the Expo development server:
```bash
npm start
```

5. Scan the QR code with Expo Go app (iOS/Android) or press `i` for iOS simulator / `a` for Android emulator

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. Enable Email/Password authentication in Authentication > Providers
4. Add your keys to the `.env` files

## Usage

### Development

- **Backend**: Runs on port 3000 by default
- **Mobile**: Expo dev server (usually port 19000)
- **API**: All API endpoints are prefixed with `/api`

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user
- `POST /api/hooks` - Create hook
- `GET /api/hooks` - Get hooks (with location filtering)
- `POST /api/hooks/:hookId/like` - Like a hook
- `POST /api/hooks/:hookId/reply` - Reply to a hook
- `POST /api/matches` - Create match
- `GET /api/matches/:userId` - Get user matches
- `GET /api/messages/:matchId` - Get messages
- `POST /api/users/:userId/block` - Block user
- `POST /api/users/:userId/report` - Report user
- `GET /api/users/nearby` - Get nearby users

### Socket.IO Events

**Client → Server:**
- `join_user` - Join user room
- `send_message` - Send chat message

**Server → Client:**
- `new_hook` - New hook posted
- `hook_liked` - Hook was liked
- `hook_replied` - Hook was replied to
- `new_match` - New match created
- `new_message` - New chat message

## Features in Detail

### Location-Based Matching

The app uses device location to:
- Filter hooks by proximity (default 1000m radius)
- Show venue names when available
- Match users in the same location

### Real-Time Features

- **Socket.IO** handles:
  - Live chat messages
  - New hook notifications
  - Like/reply updates
  - Match notifications

### Authentication Flow

1. User signs up with email/password (Supabase)
2. Completes profile setup (name, age, avatar, bio)
3. Can edit profile anytime
4. Sign out functionality

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Image storage (AWS S3 or Firebase Storage)
- [ ] Advanced matching algorithm
- [ ] Push notification service integration
- [ ] Admin dashboard
- [ ] Social login (Google, Apple, Facebook)
- [ ] Enhanced location features (venue detection)
- [ ] Media sharing in chat
- [ ] User verification
- [ ] Advanced privacy settings

## Notes

- Currently uses in-memory storage (data resets on server restart)
- Ready for database migration
- Location permissions required for full functionality
- Socket.IO connection required for real-time features

## Troubleshooting

### Mobile app can't connect to backend
- Ensure backend is running
- Check `.env` file has correct API URL
- For physical devices, use your computer's IP instead of `localhost`
- Check firewall settings

### Location not working
- Grant location permissions in device settings
- Ensure location services are enabled
- Check Expo permissions configuration

### Socket.IO connection issues
- Verify backend is running
- Check CORS settings in server
- Ensure network allows WebSocket connections

## License

This project is private and proprietary.

## Contributing

This is a private project. Contact the project owner for contribution guidelines.

