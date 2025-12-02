import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getMatches } from '../services/api';

export default function MessagesScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const data = await getMatches(user.id);
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMatchPartner = (match) => {
    return match.userId1 === user.id ? match.userId2 : match.userId1;
  };

  const renderMatch = ({ item }) => {
    const partnerId = getMatchPartner(item);
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Chat', { matchId: item.id, partnerId })}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.matchItem}>
              <Avatar.Text size={50} label={partnerId[0]?.toUpperCase() || 'U'} />
              <View style={styles.matchInfo}>
                <Text style={styles.matchName}>User {partnerId.slice(0, 8)}</Text>
                <Text style={styles.matchTime}>
                  Matched {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </Surface>

      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No matches yet. Start interacting with hooks!</Text>
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
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchInfo: {
    marginLeft: 15,
    flex: 1,
  },
  matchName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  matchTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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

