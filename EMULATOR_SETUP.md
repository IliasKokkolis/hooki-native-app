# Android Emulator Setup Guide for Hooki

## Option 1: Use Expo Go on Physical Device (Easiest - Recommended)

This is the fastest way to test without installing Android Studio:

1. **Install Expo Go** on your Android phone:
   - Download from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - Or scan QR code from Expo when you run `npm start`

2. **Make sure your phone and computer are on the same WiFi network**

3. **Run the app:**
   ```bash
   cd mobile
   npm start
   ```
   - Scan the QR code with Expo Go app
   - Or press `a` in the terminal to open on Android device

**Note:** You'll need to update `mobile/.env` to use your computer's IP address instead of localhost:
```
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:3000
```

---

## Option 2: Install Android Studio Emulator (For Testing Without Phone)

### Step 1: Install Android Studio

**Using winget (Windows Package Manager):**
```powershell
winget install Google.AndroidStudio
```

**Or download manually:**
1. Go to https://developer.android.com/studio
2. Download Android Studio for Windows
3. Run the installer
4. Follow the installation wizard
5. When prompted, install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

### Step 2: Set Up Android Virtual Device (AVD)

1. **Open Android Studio**
2. **Click "More Actions" → "Virtual Device Manager"**
3. **Click "Create Device"**
4. **Select a device:**
   - Recommended: Pixel 5 or Pixel 6
   - Click "Next"
5. **Select a system image:**
   - Recommended: Latest Android version (API 33 or 34)
   - Click "Download" if needed
   - Click "Next"
6. **Configure AVD:**
   - Name: `Hooki_Emulator` (or any name)
   - Click "Finish"

### Step 3: Start the Emulator

1. In Virtual Device Manager, click the ▶️ play button next to your AVD
2. Wait for the emulator to boot (first time may take a few minutes)

### Step 4: Configure Environment Variables

Add Android SDK to your PATH (if not already done):

```powershell
# Add to your PowerShell profile or set as environment variable
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\tools"
```

### Step 5: Run Expo on Emulator

```bash
cd mobile
npm start
```

Then press `a` in the terminal to open on Android emulator, or the emulator should auto-connect.

---

## Option 3: Use Expo Web (Quick Testing)

Test the app in your browser (some features like location won't work fully):

```bash
cd mobile
npm start
# Then press 'w' for web
```

---

## Troubleshooting

### Emulator not detected
- Make sure emulator is running before starting Expo
- Check that `adb` is in your PATH: `adb devices`
- Restart Expo: `npm start`

### Slow emulator performance
- Enable hardware acceleration in BIOS
- Allocate more RAM to emulator (in AVD settings)
- Use x86_64 system image instead of ARM

### Connection issues
- Ensure backend is running: `npm run dev` (from root)
- Check firewall settings
- Verify API URL in `mobile/.env`

---

## Quick Commands Reference

```bash
# Check if emulator is running
adb devices

# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Hooki_Emulator

# Start Expo
cd mobile
npm start
# Press 'a' for Android emulator
```

---

## Recommended Setup for Development

1. **Use Expo Go on physical device** for fastest iteration
2. **Use Android Studio emulator** for testing when phone unavailable
3. **Keep backend running** in separate terminal

