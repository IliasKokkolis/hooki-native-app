# Firebase Setup Guide for Hooki

This guide will walk you through setting up Firebase for the Hooki mobile app.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "Hooki")
4. Follow the prompts to create your project

## Step 2: Register Your App

1. In your Firebase project, click the **Web icon (</>)** to add a web app
2. Register your app with a nickname (e.g., "Hooki Mobile")
3. You don't need to set up Firebase Hosting
4. Copy the Firebase configuration object - you'll need these values

## Step 3: Enable Authentication

1. In the Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Click "Save"

## Step 4: Create Firestore Database

1. In the Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
   - **Important**: Remember to set up proper security rules before production!
4. Select a Cloud Firestore location (choose one close to your users)
5. Click "Enable"

## Step 5: Set Up Storage (Optional)

If you want to store user profile pictures and media:

1. In the Firebase Console, go to **Build > Storage**
2. Click "Get started"
3. Choose **Start in test mode** (for development)
4. Click "Done"

## Step 6: Configure Your App

1. In the `mobile` folder, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your Firebase configuration values from Step 2:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyA...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. Save the file

## Step 7: Firestore Security Rules (Important!)

For development, you can use these relaxed rules, but **DO NOT** use these in production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Hooks - authenticated users can read all, but only write their own
    match /hooks/{hookId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Matches - only involved users can read/write
    match /matches/{matchId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.users;
    }
    
    // Messages - only participants can read/write
    match /matches/{matchId}/messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Reports - authenticated users can create, admins can read
    match /reports/{reportId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null; // Add admin check in production
    }
  }
}
```

To apply these rules:
1. Go to **Firestore Database > Rules** in the Firebase Console
2. Paste the rules above
3. Click "Publish"

## Step 8: Storage Security Rules (If Using Storage)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 9: Test Your Setup

1. Restart your Expo development server:
   ```bash
   npm start
   ```

2. Try signing up with a new account
3. Check the Firebase Console:
   - **Authentication > Users** should show your new user
   - **Firestore Database > Data** should show a new document in the `users` collection

## Firestore Database Structure

The app uses the following collections:

### `users` Collection
```javascript
{
  userId: {
    email: "user@example.com",
    name: "John Doe",
    profileComplete: true,
    age: 25,
    bio: "...",
    interests: ["music", "coffee"],
    photos: ["url1", "url2"],
    location: GeoPoint(lat, lng),
    blockedUsers: ["userId1", "userId2"],
    createdAt: Timestamp,
    updatedAt: Timestamp
  }
}
```

### `hooks` Collection
```javascript
{
  hookId: {
    userId: "userId",
    content: "Looking for coffee buddies!",
    location: "Starbucks Downtown",
    likes: 5,
    likedBy: ["userId1", "userId2"],
    replies: [...],
    createdAt: Timestamp
  }
}
```

### `matches` Collection
```javascript
{
  matchId: {
    users: ["userId1", "userId2"],
    lastMessage: "Hey!",
    lastMessageAt: Timestamp,
    createdAt: Timestamp
  }
}
```

### `matches/{matchId}/messages` Subcollection
```javascript
{
  messageId: {
    senderId: "userId",
    content: "Hello!",
    read: false,
    createdAt: Timestamp
  }
}
```

### `reports` Collection
```javascript
{
  reportId: {
    reporterId: "userId",
    reportedUserId: "userId",
    reason: "Inappropriate behavior",
    status: "pending",
    createdAt: Timestamp
  }
}
```

## Troubleshooting

### "Firebase: Error (auth/operation-not-allowed)"
- Make sure Email/Password authentication is enabled in the Firebase Console

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure you're authenticated before accessing data

### Environment variables not loading
- Make sure your `.env` file is in the `mobile` folder
- Restart the Expo development server after changing `.env`
- Expo environment variables must start with `EXPO_PUBLIC_`

### "Firebase: Firebase App named '[DEFAULT]' already exists"
- This usually happens during development with hot reload
- Restart your development server

## Next Steps

1. **Set up indexes**: As your app grows, you may need to create composite indexes for complex queries
2. **Implement proper security rules**: Before going to production, tighten your security rules
3. **Set up Cloud Functions**: For server-side logic like sending notifications
4. **Enable Analytics**: Track user behavior and app performance
5. **Set up Crashlytics**: Monitor app crashes and errors

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)

