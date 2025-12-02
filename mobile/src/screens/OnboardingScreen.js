import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function OnboardingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Text style={styles.title}>Hooki</Text>
        <Text style={styles.subtitle}>Meet people in the same place</Text>
        <Text style={styles.description}>
          Connect with people at the same shop, café, or bar as you. 
          Share hooks, chat, and make real connections.
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.8}
          >
            <RNText style={styles.primaryButtonText}>Get Started</RNText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <RNText style={styles.secondaryButtonText}>Sign In</RNText>
          </TouchableOpacity>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  surface: {
    padding: 30,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
});

