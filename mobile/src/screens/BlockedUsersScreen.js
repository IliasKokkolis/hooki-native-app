import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, Avatar, Surface } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { blockUser } from '../services/api';

export default function BlockedUsersScreen() {
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState([]);

  // In a real app, this would fetch from API
  useEffect(() => {
    // Load blocked users
  }, []);

  const handleUnblock = async (blockedUserId) => {
    // Implement unblock functionality
    alert('Unblock functionality - to be implemented');
  };

  const renderBlockedUser = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.userItem}>
          <Avatar.Text size={50} label={item.name?.[0]?.toUpperCase() || 'U'} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name || 'User'}</Text>
          </View>
          <Button
            mode="outlined"
            onPress={() => handleUnblock(item.id)}
            compact
          >
            Unblock
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>Blocked Users</Text>
      </Surface>

      <FlatList
        data={blockedUsers}
        renderItem={renderBlockedUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No blocked users</Text>
          </View>
        }
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
  list: {
    padding: 15,
  },
  card: {
    marginBottom: 10,
    elevation: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
});

