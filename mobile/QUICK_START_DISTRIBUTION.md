# Quick Start: Distribute to Test Users

## TL;DR - Fastest Way to Get Started

### For Android Tester (Easiest Option)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Configure your project (first time only)
cd mobile
eas build:configure

# 4. Build APK
eas build --platform android --profile preview

# 5. Wait for build to complete (10-20 min)
# You'll get a download link - share this APK with your Android tester
```

**Android tester needs to:**
1. Download the APK file
2. Enable "Install from Unknown Sources" in Android settings
3. Install the APK

---

### For iOS Tester (Requires Apple Developer Account - $99/year)

```bash
# 1. Sign up for Apple Developer Program
# Visit: https://developer.apple.com/programs/

# 2. Build for iOS
cd mobile
eas build --platform ios --profile preview

# 3. Submit to TestFlight
eas submit --platform ios

# 4. Add tester in App Store Connect
# Visit: https://appstoreconnect.apple.com
# Go to TestFlight → Add Internal/External Testers
```

**iOS tester needs to:**
1. Check email for TestFlight invitation
2. Install TestFlight app from App Store
3. Accept invitation in TestFlight

---

## Important Notes

### Before Building

1. **Update bundle identifiers** in `app.json`:
   - Change `com.yourcompany.hooki` to your unique identifier
   - Example: `com.yourdomain.hooki` or `com.yourname.hooki`

2. **Create assets** (optional but recommended):
   - Icon: `mobile/assets/icon.png` (1024x1024)
   - Splash screen: `mobile/assets/splash.png` (1284x2778)

### Cost Breakdown

| Platform | Method | Cost |
|----------|--------|------|
| Android | Direct APK | **FREE** |
| Android | Google Play | $25 one-time |
| iOS | TestFlight | $99/year |

### EAS Build Free Tier
- 30 builds per month for free
- Enough for testing purposes
- See: https://expo.dev/pricing

---

## Troubleshooting

### "eas: command not found"
```bash
npm install -g eas-cli
```

### Build Configuration Issues
```bash
# Make sure you're in the mobile directory
cd mobile

# Reconfigure if needed
eas build:configure
```

### First-time EAS Setup
When you run `eas build:configure`, it will:
- Create `eas.json` with build profiles (already done ✓)
- Ask you to create/link an Expo project
- Generate a project ID

---

## What Happens During Build?

1. **Your code is uploaded** to Expo's servers
2. **Native app is compiled** (takes 10-20 minutes)
3. **You get a download link** for the built app
4. **Share with testers** via any method (email, Drive, etc.)

---

## Alternative: Quick Testing with Expo Go

If you just want to test ASAP without building:

```bash
# Start dev server
cd mobile
npx expo start

# Show QR code
```

**Testers:**
1. Install "Expo Go" app (App Store/Play Store)
2. Scan QR code
3. App runs instantly

⚠️ **Limitation**: May not work with all features (Firebase, custom native code)

---

## Next Steps After Testing

Once your testers have tried the app and it's ready:

### For Production Release:

**Android (Google Play):**
```bash
eas build --platform android --profile production
eas submit --platform android
```

**iOS (App Store):**
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

---

## Need Help?

- Full guide: See `TEST_DISTRIBUTION_GUIDE.md`
- EAS Docs: https://docs.expo.dev/build/introduction/
- Expo Forums: https://forums.expo.dev/

