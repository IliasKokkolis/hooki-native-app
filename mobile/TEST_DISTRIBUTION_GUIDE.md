# Test Distribution Guide for Hooki

This guide will help you distribute your app to test users on iOS and Android.

## Prerequisites

1. **Install EAS CLI globally:**
```bash
npm install -g eas-cli
```

2. **Create an Expo account** (if you don't have one):
   - Visit https://expo.dev/signup
   - Or run `eas login` and follow prompts

3. **Login to EAS:**
```bash
eas login
```

## Initial Project Setup

1. **Navigate to your mobile directory:**
```bash
cd mobile
```

2. **Configure EAS Build:**
```bash
eas build:configure
```
This creates an `eas.json` file with build configurations.

## Building for Android (APK for Direct Distribution)

### Option A: Build APK (Easiest - No Google Account Required)

1. **Build the APK:**
```bash
eas build --platform android --profile preview
```

2. **Wait for build to complete** (usually 10-20 minutes)
   - You'll get a link to download the APK
   - The build runs on Expo's servers

3. **Share the APK:**
   - Download the APK from the provided link
   - Send it to your Android tester via email, Google Drive, or any file sharing service
   - Tester needs to:
     - Enable "Install from Unknown Sources" in Android settings
     - Download and install the APK

### Option B: Internal Testing via Google Play

1. **Create a Google Play Developer account** ($25 one-time fee)
   - Visit https://play.google.com/console

2. **Create your app in Google Play Console**

3. **Build AAB (Android App Bundle):**
```bash
eas build --platform android --profile production
```

4. **Submit to Internal Testing:**
```bash
eas submit --platform android
```

5. **Add testers in Google Play Console:**
   - Go to Testing → Internal testing
   - Add tester email addresses
   - Share the opt-in link with testers

## Building for iOS (TestFlight)

### Requirements
- **Apple Developer Account** (required, $99/year)
- Visit https://developer.apple.com/programs/

### Steps

1. **Enroll in Apple Developer Program**

2. **Build for iOS:**
```bash
eas build --platform ios --profile preview
```

3. **Submit to TestFlight:**
```bash
eas submit --platform ios
```

4. **Add testers in App Store Connect:**
   - Go to https://appstoreconnect.apple.com
   - Navigate to your app → TestFlight
   - Add tester's email address
   - Tester will receive an invitation email
   - They install TestFlight app and accept invitation

## Quick Reference: Build Profiles

Edit `eas.json` to customize build profiles:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

## Recommended Approach for Your Situation

### For Android Tester:
✅ **Use EAS Build with APK (Option A above)**
- No Google account needed
- Direct APK installation
- Fastest to set up

### For iOS Tester:
✅ **Use TestFlight**
- Requires Apple Developer account ($99/year)
- Professional distribution
- Easy updates for testers

## Alternative: Expo Go (Development Only)

If you just want quick testing without building:

1. **Start development server:**
```bash
npx expo start
```

2. **Testers install "Expo Go" app:**
   - iOS: From App Store
   - Android: From Play Store

3. **Share QR code** - testers scan to run your app

⚠️ **Note**: This only works if your app doesn't use custom native code.

## Updating Your App for Testers

### For APK (Android):
- Build new version: `eas build --platform android --profile preview`
- Share new APK with tester

### For TestFlight (iOS):
- Build and submit: `eas build --platform ios && eas submit --platform ios`
- Tester automatically gets update notification in TestFlight

### For Google Play Internal Testing:
- Build and submit: `eas build --platform android && eas submit --platform android`
- Tester gets automatic update

## Troubleshooting

### "Command not found: eas"
```bash
npm install -g eas-cli
```

### Android: "App not installed"
- Enable "Install from Unknown Sources" in Settings
- Check storage space

### iOS: "Unable to install"
- Make sure tester is added in App Store Connect
- Check that TestFlight is installed

### Build fails
- Check your app.json configuration
- Ensure all dependencies are properly installed
- Check EAS build logs for specific errors

## Cost Summary

| Method | Android Cost | iOS Cost |
|--------|--------------|----------|
| Expo Go | Free | Free |
| EAS Build + APK | Free* | N/A |
| EAS Build + TestFlight | N/A | $99/year |
| Google Play Internal | $25 one-time | N/A |

*EAS Build has a free tier with limited builds per month. Check https://expo.dev/pricing

## Next Steps

1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Configure: `eas build:configure`
4. Build for Android: `eas build --platform android --profile preview`
5. Build for iOS: `eas build --platform ios --profile preview` (after Apple enrollment)

## Useful Links

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [TestFlight Guide](https://developer.apple.com/testflight/)
- [Google Play Console](https://play.google.com/console)

