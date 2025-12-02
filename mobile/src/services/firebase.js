import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  GeoPoint,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ==================== USER OPERATIONS ====================

export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: { id: userSnap.id, ...userSnap.data() } };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

export const deleteUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return { success: false, error: error.message };
  }
};

// ==================== HOOKS OPERATIONS ====================

export const createHook = async (hookData) => {
  try {
    const hooksRef = collection(db, 'hooks');
    const docRef = await addDoc(hooksRef, {
      ...hookData,
      likes: 0,
      replies: [],
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating hook:', error);
    return { success: false, error: error.message };
  }
};

export const getHooks = async (filters = {}) => {
  try {
    let q = collection(db, 'hooks');
    
    // Apply filters
    const conditions = [];
    if (filters.userId) {
      conditions.push(where('userId', '==', filters.userId));
    }
    if (filters.location) {
      conditions.push(where('location', '==', filters.location));
    }
    
    if (conditions.length > 0) {
      q = query(q, ...conditions, orderBy('createdAt', 'desc'));
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }
    
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    const hooks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: hooks };
  } catch (error) {
    console.error('Error getting hooks:', error);
    return { success: false, error: error.message };
  }
};

export const likeHook = async (hookId, userId) => {
  try {
    const hookRef = doc(db, 'hooks', hookId);
    await updateDoc(hookRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });
    return { success: true };
  } catch (error) {
    console.error('Error liking hook:', error);
    return { success: false, error: error.message };
  }
};

export const unlikeHook = async (hookId, userId) => {
  try {
    const hookRef = doc(db, 'hooks', hookId);
    await updateDoc(hookRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
    return { success: true };
  } catch (error) {
    console.error('Error unliking hook:', error);
    return { success: false, error: error.message };
  }
};

export const replyToHook = async (hookId, userId, content) => {
  try {
    const hookRef = doc(db, 'hooks', hookId);
    await updateDoc(hookRef, {
      replies: arrayUnion({
        userId,
        content,
        timestamp: new Date().toISOString(),
      }),
    });
    return { success: true };
  } catch (error) {
    console.error('Error replying to hook:', error);
    return { success: false, error: error.message };
  }
};

export const deleteHook = async (hookId) => {
  try {
    const hookRef = doc(db, 'hooks', hookId);
    await deleteDoc(hookRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting hook:', error);
    return { success: false, error: error.message };
  }
};

// ==================== MESSAGES & MATCHES ====================

export const createMatch = async (userId1, userId2) => {
  try {
    const matchId = [userId1, userId2].sort().join('_');
    const matchRef = doc(db, 'matches', matchId);
    
    await setDoc(matchRef, {
      users: [userId1, userId2],
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastMessageAt: null,
    });
    
    return { success: true, matchId };
  } catch (error) {
    console.error('Error creating match:', error);
    return { success: false, error: error.message };
  }
};

export const getMatches = async (userId) => {
  try {
    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, where('users', 'array-contains', userId));
    const querySnapshot = await getDocs(q);
    
    const matches = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: matches };
  } catch (error) {
    console.error('Error getting matches:', error);
    return { success: false, error: error.message };
  }
};

export const sendMessage = async (matchId, senderId, content) => {
  try {
    const messagesRef = collection(db, 'matches', matchId, 'messages');
    await addDoc(messagesRef, {
      senderId,
      content,
      createdAt: serverTimestamp(),
      read: false,
    });
    
    // Update last message in match
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, {
      lastMessage: content,
      lastMessageAt: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: error.message };
  }
};

export const getMessages = async (matchId) => {
  try {
    const messagesRef = collection(db, 'matches', matchId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: messages };
  } catch (error) {
    console.error('Error getting messages:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToMessages = (matchId, callback) => {
  const messagesRef = collection(db, 'matches', matchId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

export const markMessageAsRead = async (matchId, messageId) => {
  try {
    const messageRef = doc(db, 'matches', matchId, 'messages', messageId);
    await updateDoc(messageRef, { read: true });
    return { success: true };
  } catch (error) {
    console.error('Error marking message as read:', error);
    return { success: false, error: error.message };
  }
};

// ==================== LOCATION & NEARBY USERS ====================

export const updateUserLocation = async (userId, latitude, longitude) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      location: new GeoPoint(latitude, longitude),
      lastLocationUpdate: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user location:', error);
    return { success: false, error: error.message };
  }
};

export const getNearbyUsers = async (latitude, longitude, radiusInKm = 5) => {
  try {
    // Note: For production, consider using a geohashing library like geofire-common
    // for more efficient geo queries. This is a simplified version.
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const nearbyUsers = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.location) {
        const distance = calculateDistance(
          latitude,
          longitude,
          userData.location.latitude,
          userData.location.longitude
        );
        
        if (distance <= radiusInKm) {
          nearbyUsers.push({
            id: doc.id,
            ...userData,
            distance,
          });
        }
      }
    });
    
    return { success: true, data: nearbyUsers };
  } catch (error) {
    console.error('Error getting nearby users:', error);
    return { success: false, error: error.message };
  }
};

// ==================== BLOCKING & REPORTING ====================

export const blockUser = async (userId, blockedUserId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      blockedUsers: arrayUnion(blockedUserId),
    });
    return { success: true };
  } catch (error) {
    console.error('Error blocking user:', error);
    return { success: false, error: error.message };
  }
};

export const unblockUser = async (userId, blockedUserId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      blockedUsers: arrayRemove(blockedUserId),
    });
    return { success: true };
  } catch (error) {
    console.error('Error unblocking user:', error);
    return { success: false, error: error.message };
  }
};

export const getBlockedUsers = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const blockedUsers = userSnap.data().blockedUsers || [];
      return { success: true, data: blockedUsers };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error getting blocked users:', error);
    return { success: false, error: error.message };
  }
};

export const reportUser = async (reporterId, reportedUserId, reason) => {
  try {
    const reportsRef = collection(db, 'reports');
    await addDoc(reportsRef, {
      reporterId,
      reportedUserId,
      reason,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error reporting user:', error);
    return { success: false, error: error.message };
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

