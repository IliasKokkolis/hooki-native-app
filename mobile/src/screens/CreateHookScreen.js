import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { createHook, replyToHook } from '../services/api';

export default function CreateHookScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { replyTo } = route.params || {};
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [location, setLocation] = useState(null);
  const [venueName, setVenueName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      
      // Try to get venue name from reverse geocoding
      try {
        const [address] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (address) {
          setVenueName(address.name || `${address.street || ''} ${address.city || ''}`.trim());
        }
      } catch (error) {
        console.error('Error getting venue name:', error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }

    if (!location) {
      alert('Please enable location services');
      return;
    }

    setLoading(true);
    try {
      if (replyTo) {
        await replyToHook(replyTo.id, user.id, content);
      } else {
        await createHook({
          userId: user.id,
          content: content.trim(),
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          venueName: venueName || 'Current Location',
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error creating hook:', error);
      alert('Failed to post hook. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface}>
          <Text style={styles.title}>
            {replyTo ? 'Reply to Hook' : 'Create a Hook'}
          </Text>
          
          {replyTo && (
            <View style={styles.replyToContainer}>
              <Text style={styles.replyToLabel}>Replying to:</Text>
              <Text style={styles.replyToContent}>{replyTo.content}</Text>
            </View>
          )}

          {location && (
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>
                📍 {venueName || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
              </Text>
            </View>
          )}

          <TextInput
            label={replyTo ? "Your reply" : "What's on your mind?"}
            value={content}
            onChangeText={setContent}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={styles.input}
            placeholder={replyTo ? "Write your reply..." : "Share a hook with people nearby..."}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || !content.trim()}
            style={styles.button}
          >
            {replyTo ? 'Post Reply' : 'Post Hook'}
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  replyToContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  replyToLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  replyToContent: {
    fontSize: 14,
    color: '#333',
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    paddingVertical: 8,
  },
});

