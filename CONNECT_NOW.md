# 🚀 Connect to Hooki App Now!

## ✅ Setup Complete - Ready to Connect!

### Your Configuration:
- **Backend**: Running on `http://192.168.1.20:3000`
- **Mobile**: Configured for phone connection
- **IP Address**: 192.168.1.20

---

## 📱 Steps to Connect:

### 1. Install Expo Go App
**On your phone, install Expo Go:**
- **Android**: [Download from Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)

### 2. Check WiFi Connection
**IMPORTANT**: Make sure your phone and computer are on the **SAME WiFi network**

### 3. Start Expo Dev Server
Open a terminal and run:
```bash
cd mobile
npm start
```

**OR** if Expo is already running, check that terminal window.

### 4. Scan QR Code
- Look at the terminal where `npm start` is running
- You'll see a QR code displayed
- Open Expo Go app on your phone
- Tap "Scan QR Code"
- Point camera at the QR code in terminal

### 5. Alternative: Manual Connection
If QR code doesn't work:
- In Expo Go app, tap "Enter URL manually"
- Enter: `exp://192.168.1.20:8081`

---

## 🎯 What You'll See:

1. **Onboarding Screen** - Welcome to Hooki
2. **Sign Up/Login** - Create account (Supabase needed for full auth)
3. **Profile Setup** - Complete your profile
4. **Feed** - Start viewing and creating hooks!

---

## 🔧 Troubleshooting:

### Can't see QR code?
- Make sure Expo is running: `cd mobile && npm start`
- Check terminal output for any errors

### Connection failed?
- Verify both devices on same WiFi
- Check firewall isn't blocking port 8081
- Try restarting Expo: Press `Ctrl+C` then `npm start` again

### Backend not connecting?
- Verify backend is running: `npm run dev` (from root)
- Test: Open `http://192.168.1.20:3000/api/health` in browser

---

## 📝 Quick Commands:

```bash
# Terminal 1: Backend (if not running)
npm run dev

# Terminal 2: Expo (if not running)
cd mobile
npm start
```

---

## ✨ You're Ready!

The app is configured and ready. Just:
1. ✅ Install Expo Go
2. ✅ Connect to same WiFi
3. ✅ Scan QR code
4. 🎉 Start testing Hooki!

