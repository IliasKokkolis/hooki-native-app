import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export default function DiscoveryScreen({ navigation }) {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOtherUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOtherUsers();
    setRefreshing(false);
  };

  const loadOtherUsers = async () => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      if (usersData) {
        const allUsers = JSON.parse(usersData);
        // Get all users except current user, filter by completed profiles
        const otherUsers = Object.values(allUsers)
          .map((u) => u.user)
          .filter((u) => u.id !== user.id && u.profileComplete);
        setUsers(otherUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const renderUserCard = (otherUser) => {
    const mainPhoto = otherUser.photos?.[0] || otherUser.profileImage;
    const hasTable = otherUser.isSharingTable && otherUser.availableSeats > 0;

    return (
      <TouchableOpacity
        key={otherUser.id}
        style={styles.card}
        onPress={() =>
          navigation.navigate('UserProfile', { user: otherUser })
        }
        activeOpacity={0.95}
      >
        {mainPhoto && (
          <Image source={{ uri: mainPhoto }} style={styles.cardImage} />
        )}
        
        {/* Available Seats Badge */}
        {hasTable && (
          <View style={styles.seatsBadge}>
            <Text style={styles.seatsBadgeText}>
              🪑 {otherUser.availableSeats} seat{otherUser.availableSeats > 1 ? 's' : ''}
            </Text>
          </View>
        )}
        
        <View style={styles.cardOverlay}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>
              {otherUser.name}, {otherUser.age}
            </Text>
            
            {/* Table Info */}
            {hasTable && (
              <View style={styles.tableInfoBox}>
                <Text style={styles.tableVenue}>📍 {otherUser.venueName}</Text>
                {otherUser.withFriends && (
                  <Text style={styles.tableWithFriends}>👥 With friends</Text>
                )}
              </View>
            )}
            
            {otherUser.bio && (
              <Text style={styles.cardBio} numberOfLines={2}>
                {otherUser.bio}
              </Text>
            )}
            {otherUser.interests && otherUser.interests.length > 0 && (
              <View style={styles.interestsContainer}>
                {otherUser.interests.slice(0, 3).map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
                {otherUser.interests.length > 3 && (
                  <View style={styles.interestTag}>
                    <Text style={styles.interestText}>
                      +{otherUser.interests.length - 3}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.cardActions}>
            {hasTable && (
              <TouchableOpacity
                style={styles.requestSeatButton}
                onPress={() =>
                  navigation.navigate('Chat', {
                    userId: otherUser.id,
                    userName: otherUser.name,
                  })
                }
              >
                <Text style={styles.requestSeatButtonText}>🪑 Request Seat</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.messageButton, hasTable && styles.messageButtonSecondary]}
              onPress={() =>
                navigation.navigate('Chat', {
                  userId: otherUser.id,
                  userName: otherUser.name,
                })
              }
            >
              <Text style={[styles.messageButtonText, hasTable && styles.messageButtonTextSecondary]}>
                💬 Message
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B6B']} />
      }
    >
      <Text style={styles.title}>Discover People</Text>
      <Text style={styles.subtitle}>
        {users.length} {users.length === 1 ? 'person' : 'people'} nearby
      </Text>

      {users.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>😔</Text>
          <Text style={styles.emptyText}>No other users yet</Text>
          <Text style={styles.emptySubtext}>
            Create more accounts to test the app!
          </Text>
        </View>
      ) : (
        <View style={styles.cardsContainer}>
          {users.map((otherUser) => renderUserCard(otherUser))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  cardsContainer: {
    gap: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  seatsBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  seatsBadgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cardInfo: {
    marginBottom: 15,
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  tableInfoBox: {
    marginBottom: 10,
  },
  tableVenue: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '600',
    marginBottom: 3,
  },
  tableWithFriends: {
    fontSize: 13,
    color: '#FFF',
    opacity: 0.9,
  },
  cardBio: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 12,
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  interestText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  requestSeatButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
  },
  requestSeatButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  messageButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  messageButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  messageButtonTextSecondary: {
    color: '#FFF',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

