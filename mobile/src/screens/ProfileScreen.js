import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Text, Button, Surface, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.profileSection}>
        <Avatar.Text
          size={100}
          label={user?.name?.[0]?.toUpperCase() || 'U'}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        {user?.age && <Text style={styles.age}>{user.age} years old</Text>}
        {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}
        
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.editButton}
        >
          Edit Profile
        </Button>
      </Surface>

      <Surface style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Privacy Settings</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('BlockedUsers')}
        >
          <Text style={styles.menuText}>Blocked Users</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Report', { reportedUserId: 'example' })}
        >
          <Text style={styles.menuText}>Report a Problem</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </Surface>

      <Button
        mode="outlined"
        onPress={handleSignOut}
        style={styles.signOutButton}
        textColor="#FF6B6B"
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  avatar: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  age: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  editButton: {
    marginTop: 10,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 24,
    color: '#999',
  },
  signOutButton: {
    margin: 20,
    borderColor: '#FF6B6B',
  },
});

