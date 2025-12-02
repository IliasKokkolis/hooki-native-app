# Firebase Setup Checklist ✅

Follow these steps exactly to avoid confusion:

## Step 1: Firebase Console Setup

### A. Create Project
1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Name: "Hooki" (or whatever you prefer)
4. Enable Google Analytics (optional)
5. Click "Create project"

### B. Add Web App (IMPORTANT!)
1. In Project Overview, click the **WEB icon** `</>`
   - **NOT** the Android or iOS icons!
   - The web icon looks like: `</>`
2. Register app:
   - App nickname: "Hooki Mobile"
   - Don't check "Firebase Hosting"
3. Click "Register app"
4. **COPY** the configuration object - you'll need these values!

```javascript
// Your config will look like this:
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "hooki-xyz.firebaseapp.com",
  projectId: "hooki-xyz",
  storageBucket: "hooki-xyz.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456"
};
```

5. Click "Continue to console"

### C. Enable Authentication
1. Left sidebar → **Build** → **Authentication**
2. Click "Get started"
3. Click "Sign-in method" tab
4. Click "Email/Password"
5. Enable the **first toggle** (Email/Password)
6. Click "Save"

### D. Create Firestore Database
1. Left sidebar → **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **"Start in test mode"** (for development)
4. Select Cloud Firestore location:
   - Choose closest to your users (e.g., "us-central" or "europe-west")
5. Click "Enable"

### E. (Optional) Enable Storage
1. Left sidebar → **Build** → **Storage**
2. Click "Get started"
3. Choose **"Start in test mode"**
4. Use same location as Firestore
5. Click "Done"

## Step 2: Configure Your App

### A. Create .env file
```bash
# In the mobile folder
cd "C:\Users\StRanger\Desktop\Secondary Files\Hooki2\mobile"
copy env.template .env
```

### B. Add your Firebase credentials
Open `.env` and paste your values from Step 1B:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=hooki-xyz.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=hooki-xyz
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=hooki-xyz.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc123def456
```

### C. Restart Expo
```bash
npm start --clear
```

## Step 3: Test It!

1. Open your app in Expo Go
2. Try creating a new account
3. Check Firebase Console:
   - **Authentication → Users** - Should see new user
   - **Firestore → Data** - Should see user document

## Common Mistakes ❌

### ❌ Wrong: Choosing Android/iOS app
- Don't click Android or iOS icons
- Don't enter package names
- These are for native apps only

### ✅ Right: Choose Web app
- Click the `</>` web icon
- This is for Expo/React Native with Firebase JS SDK
- No package name needed

### ❌ Wrong: Not restarting Expo
- Environment variables only load on start
- Must restart after creating/editing .env

### ✅ Right: Restart with --clear
```bash
npm start --clear
```

## Troubleshooting

### "Cannot find Firebase config"
- Check that `.env` file exists in `mobile/` folder
- Verify all variables start with `EXPO_PUBLIC_`
- Restart Expo dev server

### "FirebaseError: Firebase: Error (auth/operation-not-allowed)"
- Email/Password auth not enabled
- Go to Firebase Console → Authentication → Sign-in method
- Enable Email/Password

### "Missing or insufficient permissions"
- Firestore not created
- Or not in test mode
- Go to Firestore → Rules → Publish test mode rules

### Package name confusion
- You chose Android/iOS instead of Web
- Delete that app in Firebase Console
- Add new Web app instead

## Security Rules (For Later)

Once everything works, update Firestore rules:

1. Firebase Console → Firestore → Rules
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /hooks/{hookId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /matches/{matchId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.users;
    }
    
    match /matches/{matchId}/messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    match /reports/{reportId} {
      allow create: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

## Next Steps After Setup

1. ✅ Test sign up/sign in
2. ✅ Check Firebase Console for data
3. Update your screens to use Firebase functions
4. Add profile pictures with Storage
5. Set up proper security rules
6. Deploy!

---

**Still stuck?** Check:
- FIREBASE_QUICKSTART.md - Quick reference
- FIREBASE_SETUP.md - Detailed guide
- Firebase Docs: https://firebase.google.com/docs/web/setup

