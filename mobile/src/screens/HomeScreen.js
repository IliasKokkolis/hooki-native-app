import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Hooki! 🎉</Text>
        <Text style={styles.greeting}>Hi, {user?.name}!</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile Complete! ✓</Text>
          <Text style={styles.cardText}>
            Your profile is ready! View your profile to see how other users will see you.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.primaryButtonText}>View My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={signOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  greeting: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 20,
    marginBottom: 30,
    width: '100%',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

