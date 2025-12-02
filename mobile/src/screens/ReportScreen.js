import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, RadioButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { reportUser } from '../services/api';

export default function ReportScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { reportedUserId } = route.params;
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [loading, setLoading] = useState(false);

  const reportReasons = [
    'Inappropriate content',
    'Harassment',
    'Spam',
    'Fake profile',
    'Other',
  ];

  const handleSubmit = async () => {
    if (!selectedReason && !reason.trim()) {
      alert('Please select a reason or provide details');
      return;
    }

    setLoading(true);
    try {
      await reportUser(user.id, reportedUserId, selectedReason || reason);
      alert('Thank you for your report. We will review it shortly.');
      navigation.goBack();
    } catch (error) {
      console.error('Error reporting user:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Text style={styles.title}>Report User</Text>
        <Text style={styles.subtitle}>Help us keep Hooki safe</Text>

        <Text style={styles.label}>Reason for reporting:</Text>
        <RadioButton.Group
          onValueChange={setSelectedReason}
          value={selectedReason}
        >
          {reportReasons.map((r) => (
            <View key={r} style={styles.radioOption}>
              <RadioButton value={r} />
              <Text style={styles.radioLabel}>{r}</Text>
            </View>
          ))}
        </RadioButton.Group>

        {selectedReason === 'Other' && (
          <TextInput
            label="Please provide details"
            value={reason}
            onChangeText={setReason}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Submit Report
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 20,
    padding: 30,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    marginTop: 15,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
});

