# Quick Start - Test Hooki App

## Fastest Way: Use Expo Go on Your Phone

### Step 1: Install Expo Go App
- **Android**: Download from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779)

### Step 2: Find Your Computer's IP Address

**Windows PowerShell:**
```powershell
ipconfig | findstr IPv4
```
Look for the IP address (usually starts with 192.168.x.x or 10.x.x.x)

### Step 3: Update Environment File

Edit `mobile/.env`:
```
EXPO_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Step 4: Start Backend (Terminal 1)
```bash
npm run dev
```

### Step 5: Start Mobile App (Terminal 2)
```bash
cd mobile
npm start
```

### Step 6: Connect Your Phone
1. Make sure phone and computer are on the **same WiFi network**
2. Scan the QR code with Expo Go app
3. Or press `a` (Android) or `i` (iOS) in the terminal

---

## Alternative: Install Android Studio Emulator

If you want to use an emulator instead:

1. **Continue Android Studio installation:**
   ```powershell
   winget install --id Google.AndroidStudio --accept-package-agreements --accept-source-agreements
   ```

2. **After installation:**
   - Open Android Studio
   - Go through setup wizard
   - Install Android SDK and AVD
   - Create a virtual device (Pixel 5, API 33+)
   - Start the emulator
   - Run `cd mobile && npm start` then press `a`

**Note:** First-time setup takes 15-30 minutes

---

## Test the App

Once connected:
1. Sign up with email/password
2. Complete profile setup
3. Grant location permissions
4. Create a hook to test the feed!

