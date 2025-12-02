# Android Distribution - Step by Step

## ✅ What You'll Accomplish
Build an APK file that your Android tester can install directly on their phone.

**Time Required:** ~25 minutes (most of it is waiting for the build)  
**Cost:** FREE

---

## Step 1: Update Bundle Identifier (2 minutes)

Open `mobile/app.json` and change the package name on line 16:

**Before:**
```json
"package": "com.yourcompany.hooki"
```

**After:**
`  /
```

Replace `yourname` with something unique (your name, domain, etc.)

---

## Step 2: Install EAS CLI (1 minute)

Open your terminal and run:

```bash
npm install -g eas-cli
```

---

## Step 3: Login to Expo (1 minute)

```bash
eas login
```

- If you don't have an account, create one at https://expo.dev/signup
- It's free!

---

## Step 4: Configure EAS (1 minute)

Navigate to your mobile directory:

```bash
cd mobile
```

Then configure EAS:

```bash
eas build:configure
```

This will:
- Ask you to create/link an Expo project
- Generate a project ID
- Update your `app.json` with the project ID

Just follow the prompts and say "yes" to creating a new project.

---

## Step 5: Build the APK (20 minutes)

Run this command:

```bash
eas build --platform android --profile preview
```

What happens:
1. Your code is uploaded to Expo's servers
2. A native Android app is compiled
3. You get a download link for the APK

**Wait for it to complete** - grab a coffee! ☕

---

## Step 6: Download and Share

Once the build completes:

1. **Click the download link** in your terminal (or check your email)
2. **Download the APK file**
3. **Share it** with your Android tester via:
   - Email
   - Google Drive
   - Any file sharing method

---

## For Your Android Tester

Send these instructions to your tester:

### How to Install the APK

1. **Download the APK** file I sent you

2. **Enable installation from unknown sources:**
   - Go to Settings → Security (or Apps & notifications)
   - Find "Install unknown apps" or "Unknown sources"
   - Enable it for your browser or file manager

3. **Install the app:**
   - Tap the downloaded APK file
   - Tap "Install"
   - Open the app!

---

## Troubleshooting

### "eas: command not found"
```bash
npm install -g eas-cli --force
```

### "You need to log in"
```bash
eas login
```

### Build fails
- Check that you updated the package name in `app.json`
- Make sure you're in the `mobile` directory
- Check build logs in the EAS dashboard

### Android tester: "App not installed"
- Make sure "Install from unknown sources" is enabled
- Check device storage
- Try uninstalling any previous version first

---

## Updating Your App Later

When you fix bugs or add features:

1. **Update version** in `app.json`:
```json
"version": "1.0.1"
```

2. **Build new APK:**
```bash
eas build --platform android --profile preview
```

3. **Share new APK** with tester - they can install over the old version

---

## Next Steps After Testing

Once testing is successful and you want to publish to Google Play:

1. **Create Google Play Developer account** ($25 one-time)
2. **Build production version:**
```bash
eas build --platform android --profile production
```

3. **Submit to Play Store:**
```bash
eas submit --platform android
```

---

## Quick Command Reference

```bash
# Check build status
eas build:list

# View project info
eas project:info

# Build APK for testing
eas build --platform android --profile preview

# Cancel a build
eas build:cancel
```

---

**Ready to start?** Open your terminal and begin with Step 2! 🚀

