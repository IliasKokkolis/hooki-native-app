# Hooki Setup Guide

## Quick Start

### 1. Backend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp server/.env.example server/.env
# Edit server/.env with your Supabase credentials

# Start server
npm run dev
```

### 2. Mobile App Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API URL and Supabase credentials

# Start Expo
npm start
```

### 3. Supabase Configuration

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy:
   - Project URL → `EXPO_PUBLIC_SUPABASE_URL`
   - Anon Key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
5. Enable Email/Password auth in Authentication > Providers

### 4. Environment Variables

**server/.env:**
```
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_random_secret_key
```

**mobile/.env:**
```
EXPO_PUBLIC_API_URL=http://localhost:3000
# For physical device, use your computer's IP: http://192.168.1.XXX:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the App

1. Start backend: `npm run dev` (from root)
2. Start mobile: `cd mobile && npm start` (from mobile directory)
3. Scan QR code with Expo Go app or use simulator
4. Sign up with email/password
5. Complete profile setup
6. Grant location permissions when prompted
7. Create a hook to test the feed

## Troubleshooting

### Cannot connect to backend
- Ensure backend is running on port 3000
- Check firewall settings
- For physical devices, use computer's IP instead of localhost

### Location not working
- Grant location permissions in device settings
- Check Expo permissions in app.json

### Socket.IO connection issues
- Verify backend is running
- Check CORS settings
- Ensure WebSocket connections are allowed

## Next Steps

- Set up database (PostgreSQL/MongoDB)
- Configure image storage (AWS S3/Firebase Storage)
- Set up push notification service
- Deploy backend to production
- Build and publish mobile app

