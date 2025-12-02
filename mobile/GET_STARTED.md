# Quick Start Instructions

## 1. Create .env file

Create a file named `.env` in the `mobile` folder with:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key_here
```

**Important:** If testing on a physical device, replace `localhost` with your computer's IP address:
- Find your IP: Run `ipconfig` in PowerShell and look for IPv4 address
- Example: `EXPO_PUBLIC_API_URL=http://192.168.1.100:3000`

## 2. Start Backend Server

Open a new terminal and run:
```bash
npm run dev
```

## 3. Start Expo (Already Running!)

The Expo dev server should be starting. You'll see:
- A QR code in the terminal
- Options to press `a` for Android, `i` for iOS, `w` for web

## 4. Connect Your Phone

**Option A: Expo Go App (Recommended)**
1. Install Expo Go from Play Store (Android) or App Store (iOS)
2. Make sure phone and computer are on the same WiFi
3. Scan the QR code with Expo Go
4. Or press `a` (Android) or `i` (iOS) in the terminal

**Option B: Android Emulator**
- Start your Android emulator first
- Then press `a` in the Expo terminal

## 5. Test the App

Once connected:
1. Sign up with email/password
2. Complete your profile
3. Grant location permissions
4. Create a hook!

---

## Troubleshooting

**Can't connect?**
- Check that backend is running (`npm run dev`)
- Verify `.env` file has correct API URL
- For physical device: Use computer's IP, not localhost
- Ensure phone and computer are on same WiFi

**Expo not starting?**
- Make sure you're in the `mobile` directory
- Check that `node_modules` exists
- Try `npm start` again

