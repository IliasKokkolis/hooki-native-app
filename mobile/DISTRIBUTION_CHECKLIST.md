# Distribution Checklist

Use this checklist to track your progress in setting up test distribution.

## ✅ Prerequisites

- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Create Expo account at https://expo.dev/signup
- [ ] Login to EAS: `eas login`

## ✅ Project Configuration

- [ ] Update bundle identifier in `app.json`:
  - Current: `com.yourcompany.hooki`
  - Change to: `com.__________.hooki` (your unique identifier)
  
- [ ] Run `eas build:configure` in mobile directory
- [ ] Project ID generated in `app.json`

## ✅ Assets (Optional but Recommended)

- [ ] Create app icon: `mobile/assets/icon.png` (1024x1024 PNG)
- [ ] Create splash screen: `mobile/assets/splash.png` (1284x2778 PNG)

> **Tip**: You can skip these for now and use placeholders. Add them before production release.

## ✅ Android Distribution

### Option 1: Direct APK (Recommended for Testing)

- [ ] Run: `eas build --platform android --profile preview`
- [ ] Wait for build (10-20 minutes)
- [ ] Download APK from provided link
- [ ] Share APK file with Android tester
- [ ] Confirm tester can install and run app

**Android Tester Instructions:**
- [ ] Enable "Install from Unknown Sources"
- [ ] Download APK
- [ ] Install app
- [ ] Test app functionality

### Option 2: Google Play Internal Testing (Optional)

- [ ] Create Google Play Developer account ($25)
- [ ] Create app in Google Play Console
- [ ] Run: `eas build --platform android --profile production`
- [ ] Run: `eas submit --platform android`
- [ ] Add tester in Play Console
- [ ] Share opt-in link with tester

## ✅ iOS Distribution

### Requirements

- [ ] Sign up for Apple Developer Program ($99/year)
  - Visit: https://developer.apple.com/programs/
- [ ] Complete enrollment (may take 24-48 hours)

### Build and Submit

- [ ] Update iOS bundle identifier in `app.json` if needed
- [ ] Run: `eas build --platform ios --profile preview`
- [ ] Wait for build (15-25 minutes)
- [ ] Run: `eas submit --platform ios`
- [ ] Login to App Store Connect: https://appstoreconnect.apple.com

### TestFlight Setup

- [ ] Navigate to your app in App Store Connect
- [ ] Go to TestFlight tab
- [ ] Add tester's email address
- [ ] Tester receives invitation email

**iOS Tester Instructions:**
- [ ] Check email for TestFlight invitation
- [ ] Install TestFlight from App Store
- [ ] Open invitation link
- [ ] Install app from TestFlight
- [ ] Test app functionality

## ✅ Testing Feedback

- [ ] Android tester can login
- [ ] iOS tester can login
- [ ] Firebase authentication works
- [ ] All features working as expected
- [ ] Collect feedback from testers

## ✅ Updates (When Ready)

When you fix bugs or add features:

**For Android APK:**
- [ ] Increment version in `app.json`
- [ ] Run: `eas build --platform android --profile preview`
- [ ] Share new APK with tester

**For iOS TestFlight:**
- [ ] Increment version in `app.json`
- [ ] Run: `eas build --platform ios --profile preview`
- [ ] Run: `eas submit --platform ios`
- [ ] Tester gets automatic update notification

## 📝 Notes

### Build Times
- Android: ~10-20 minutes
- iOS: ~15-25 minutes

### Free Tier Limits
- EAS Build free tier: 30 builds/month
- More than enough for testing

### Costs Summary
- EAS Build: Free (30 builds/month)
- Android APK: Free
- Google Play: $25 one-time (optional)
- Apple Developer: $99/year (required for iOS)

## 🆘 Common Issues

### Build Fails
- Check build logs in EAS dashboard
- Ensure all dependencies in package.json are correct
- Verify app.json configuration

### Android: "App not installed"
- Enable "Install from Unknown Sources"
- Check device has enough storage
- Try uninstalling previous version

### iOS: Not receiving TestFlight invitation
- Check spam folder
- Verify email address in App Store Connect
- Wait up to 30 minutes for email

### "Command not found: eas"
```bash
npm install -g eas-cli
# or
npm install -g eas-cli --force
```

## 🎯 Quick Commands Reference

```bash
# Login
eas login

# Configure (first time)
eas build:configure

# Build Android APK
eas build --platform android --profile preview

# Build iOS
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios

# Submit to Google Play
eas submit --platform android

# Check build status
eas build:list

# View project info
eas project:info
```

---

**Ready to start?** Begin with the Prerequisites section! ☝️

