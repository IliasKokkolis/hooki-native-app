import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { MessagesProvider } from './src/context/MessagesContext';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileViewScreen from './src/screens/ProfileViewScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import TableAvailabilityScreen from './src/screens/TableAvailabilityScreen';
import DiscoveryScreen from './src/screens/DiscoveryScreen';
import MessagesListScreen from './src/screens/MessagesListScreen';
import ChatScreen from './src/screens/ChatScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Welcome Screen (shown when not logged in)
function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.card}>
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
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// Auth Stack (for unauthenticated users)
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FF6B6B' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: 'Sign Up' }}
      />
    </Stack.Navigator>
  );
}

// Discovery Stack
function DiscoveryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FF6B6B' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="DiscoveryMain"
        component={DiscoveryScreen}
        options={{ title: 'Discover' }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({ title: route.params.userName })}
      />
    </Stack.Navigator>
  );
}

// Messages Stack
function MessagesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FF6B6B' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="MessagesList"
        component={MessagesListScreen}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({ title: route.params.userName })}
      />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FF6B6B' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="ProfileView"
        component={ProfileViewScreen}
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="TableAvailability"
        component={TableAvailabilityScreen}
        options={{ title: 'Share Your Table' }}
      />
    </Stack.Navigator>
  );
}

// Main App Tabs (for authenticated users)
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Discovery"
        component={DiscoveryStack}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24, color }}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStack}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24, color }}>💬</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Stack (for authenticated users)
function AppStack() {
  const { user } = useAuth();

  // If user hasn't completed profile, show profile setup
  if (user && !user.profileComplete) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#FF6B6B' },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="ProfileSetup"
          component={ProfileSetupScreen}
          options={{ title: 'Complete Your Profile', headerLeft: null }}
        />
      </Stack.Navigator>
    );
  }

  return <AppTabs />;
}

// Navigation based on auth state
function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MessagesProvider>
          <Navigation />
        </MessagesProvider>
      </AuthProvider>
    </SafeAreaProvider>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
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
  primaryButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
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
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
});
