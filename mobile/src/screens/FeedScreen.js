import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Text, Button, Avatar, FAB, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { getHooks, likeHook, createMatch } from '../services/api';
import { useSocket } from '../context/SocketContext';

export default function FeedScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const socket = useSocket();
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
    loadHooks();
    
    if (socket) {
      socket.on('new_hook', (hook) => {
        setHooks(prev => [hook, ...prev]);
      });

      socket.on('hook_liked', ({ hookId, userId }) => {
        if (userId === user?.id) {
          // Show notification that someone liked your hook
        }
      });

      return () => {
        socket.off('new_hook');
        socket.off('hook_liked');
      };
    }
  }, [socket, user]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    }
  };

  const loadHooks = async () => {
    try {
      const params = location
        ? { latitude: location.latitude, longitude: location.longitude, radius: 1000 }
        : {};
      const data = await getHooks(params);
      setHooks(data);
    } catch (error) {
      console.error('Error loading hooks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLike = async (hook) => {
    try {
      await likeHook(hook.id, user.id);
      // Check if we should create a match
      if (hook.userId !== user.id && !hook.likes.includes(user.id)) {
        // In a real app, you'd check mutual likes here
        // For now, we'll create a match on first like
      }
    } catch (error) {
      console.error('Error liking hook:', error);
    }
  };

  const handleReply = (hook) => {
    // Navigate to reply screen or show reply modal
    navigation.navigate('CreateHook', { replyTo: hook });
  };

  const renderHook = ({ item }) => (
    <Card style={styles.card} onPress={() => handleReply(item)}>
      <Card.Content>
        <View style={styles.hookHeader}>
          <Avatar.Text size={40} label={item.userName?.[0] || 'U'} />
          <View style={styles.hookInfo}>
            <Text style={styles.userName}>{item.userName || 'Anonymous'}</Text>
            <Text style={styles.venueName}>{item.venueName || 'Nearby'}</Text>
          </View>
        </View>
        <Text style={styles.hookContent}>{item.content}</Text>
        <View style={styles.hookActions}>
          <Button
            icon="heart"
            mode={item.likes?.includes(user?.id) ? 'contained' : 'outlined'}
            onPress={() => handleLike(item)}
            compact
          >
            {item.likes?.length || 0}
          </Button>
          <Button
            icon="reply"
            mode="outlined"
            onPress={() => handleReply(item)}
            compact
          >
            Reply
          </Button>
        </View>
        {item.replies?.length > 0 && (
          <View style={styles.repliesContainer}>
            <Text style={styles.repliesTitle}>Replies ({item.replies.length})</Text>
            {item.replies.slice(0, 2).map((reply) => (
              <View key={reply.id} style={styles.reply}>
                <Text style={styles.replyContent}>{reply.content}</Text>
              </View>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>Hooks Feed</Text>
        {location && (
          <Text style={styles.locationText}>
            📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        )}
      </Surface>

      <FlatList
        data={hooks}
        renderItem={renderHook}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadHooks();
          }} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hooks nearby. Be the first to post!</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateHook')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  list: {
    padding: 15,
  },
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  hookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  hookInfo: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  venueName: {
    fontSize: 12,
    color: '#666',
  },
  hookContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    lineHeight: 22,
  },
  hookActions: {
    flexDirection: 'row',
    gap: 10,
  },
  repliesContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  repliesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  reply: {
    marginBottom: 8,
  },
  replyContent: {
    fontSize: 14,
    color: '#666',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6B6B',
  },
});

