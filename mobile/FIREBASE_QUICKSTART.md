# Firebase Quick Start

## What's Been Set Up

✅ Firebase SDK installed  
✅ Firebase configuration file created (`src/config/firebase.js`)  
✅ Firebase service module with database operations (`src/services/firebase.js`)  
✅ AuthContext updated to use Firebase Authentication  
✅ Environment template created (`env.template`)  

## Quick Setup (5 Minutes)

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Add a web app to get your configuration

### 2. Enable Services
- **Authentication**: Enable Email/Password sign-in
- **Firestore Database**: Create database in test mode
- **Storage** (optional): Enable for profile pictures

### 3. Configure App
```bash
# In the mobile folder
cp env.template .env
```

Edit `.env` with your Firebase credentials:
```
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyA...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Start App
```bash
npm start
```

## Available Firebase Functions

### Authentication
- `signUp(email, password, name)` - Create new user
- `signIn(email, password)` - Sign in existing user
- `signOut()` - Sign out current user
- `updateProfile(data)` - Update user profile
- `resetPassword(email)` - Send password reset email

### Users
- `createUserProfile(userId, data)` - Create user profile in Firestore
- `getUserProfile(userId)` - Get user profile
- `updateUserProfile(userId, data)` - Update user profile
- `getNearbyUsers(lat, lng, radius)` - Find nearby users

### Hooks (Posts)
- `createHook(data)` - Create new hook
- `getHooks(filters)` - Get hooks with optional filters
- `likeHook(hookId, userId)` - Like a hook
- `unlikeHook(hookId, userId)` - Unlike a hook
- `replyToHook(hookId, userId, content)` - Reply to hook
- `deleteHook(hookId)` - Delete hook

### Messaging
- `createMatch(userId1, userId2)` - Create chat match
- `getMatches(userId)` - Get user's matches
- `sendMessage(matchId, senderId, content)` - Send message
- `getMessages(matchId)` - Get messages
- `subscribeToMessages(matchId, callback)` - Real-time message updates

### Safety
- `blockUser(userId, blockedUserId)` - Block a user
- `unblockUser(userId, blockedUserId)` - Unblock a user
- `reportUser(reporterId, reportedUserId, reason)` - Report a user

## Example Usage

### Sign Up
```javascript
import { useAuth } from './src/context/AuthContext';

const { signUp } = useAuth();
const result = await signUp('user@example.com', 'password123', 'John Doe');
if (result.success) {
  console.log('Account created!');
}
```

### Create Hook
```javascript
import { createHook } from './src/services/firebase';

const result = await createHook({
  userId: user.id,
  content: 'Looking for coffee buddies!',
  location: 'Starbucks Downtown',
});
```

### Real-time Messages
```javascript
import { subscribeToMessages } from './src/services/firebase';

const unsubscribe = subscribeToMessages(matchId, (messages) => {
  setMessages(messages);
});

// Clean up subscription
return () => unsubscribe();
```

## Next Steps

1. Set up your Firebase project (see FIREBASE_SETUP.md for detailed instructions)
2. Configure your `.env` file
3. Test authentication by creating a new account
4. Update your screens to use Firebase functions instead of the old API

## Migration from Old API

The app previously used a REST API with AsyncStorage. Now it uses:

- **Firebase Authentication** instead of local storage for user accounts
- **Firestore** instead of REST API for data storage
- **Real-time listeners** for instant updates (messages, etc.)

You can gradually migrate by:
1. Using Firebase for new features
2. Keeping the old API functions as fallback
3. Slowly replacing old API calls with Firebase calls

## Support

For detailed setup instructions, see `FIREBASE_SETUP.md`

For Firebase documentation, visit [firebase.google.com/docs](https://firebase.google.com/docs)

