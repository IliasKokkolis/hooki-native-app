import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function TableAvailabilityScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  // Initialize with existing data
  const [isSharingTable, setIsSharingTable] = useState(user.isSharingTable || false);
  const [availableSeats, setAvailableSeats] = useState(user.availableSeats?.toString() || '1');
  const [venueName, setVenueName] = useState(user.venueName || '');
  const [venueType, setVenueType] = useState(user.venueType || 'Café');
  const [withFriends, setWithFriends] = useState(user.withFriends || false);
  const [tableNote, setTableNote] = useState(user.tableNote || '');

  const venueTypes = ['Café', 'Bar', 'Restaurant', 'Club', 'Park', 'Library', 'Other'];

  const handleSave = async () => {
    if (isSharingTable && !venueName.trim()) {
      Alert.alert('Venue Required', 'Please enter the venue name');
      return;
    }

    setLoading(true);

    const tableData = {
      isSharingTable,
      availableSeats: isSharingTable ? parseInt(availableSeats) || 1 : 0,
      venueName: isSharingTable ? venueName.trim() : '',
      venueType: isSharingTable ? venueType : '',
      withFriends: isSharingTable ? withFriends : false,
      tableNote: isSharingTable ? tableNote.trim() : '',
    };

    const result = await updateProfile(tableData);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Success',
        isSharingTable
          ? 'Your table is now visible to others!'
          : 'Table sharing disabled',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to update table availability');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>🪑</Text>
            <Text style={styles.headerTitle}>Share Your Table</Text>
            <Text style={styles.headerSubtitle}>
              Let others know you have available seats and are open to meeting new people
            </Text>
          </View>

          {/* Enable Sharing Toggle */}
          <View style={styles.section}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>Share My Table</Text>
                <Text style={styles.toggleSubtitle}>
                  Make your table visible to others nearby
                </Text>
              </View>
              <Switch
                value={isSharingTable}
                onValueChange={setIsSharingTable}
                trackColor={{ false: '#E0E0E0', true: '#FFB3B3' }}
                thumbColor={isSharingTable ? '#FF6B6B' : '#F4F4F4'}
                ios_backgroundColor="#E0E0E0"
              />
            </View>
          </View>

          {isSharingTable && (
            <>
              {/* Available Seats */}
              <View style={styles.section}>
                <Text style={styles.label}>Available Seats</Text>
                <View style={styles.seatsButtons}>
                  {[1, 2, 3, 4, 5, 6].map((seatNum) => (
                    <TouchableOpacity
                      key={seatNum}
                      style={[
                        styles.seatButton,
                        availableSeats === seatNum.toString() && styles.seatButtonActive,
                      ]}
                      onPress={() => setAvailableSeats(seatNum.toString())}
                    >
                      <Text style={styles.seatButtonIcon}>🪑</Text>
                      <Text
                        style={[
                          styles.seatButtonText,
                          availableSeats === seatNum.toString() && styles.seatButtonTextActive,
                        ]}
                      >
                        {seatNum}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Venue Type */}
              <View style={styles.section}>
                <Text style={styles.label}>Venue Type</Text>
                <View style={styles.venueTypes}>
                  {venueTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.venueTypeButton,
                        venueType === type && styles.venueTypeButtonActive,
                      ]}
                      onPress={() => setVenueType(type)}
                    >
                      <Text
                        style={[
                          styles.venueTypeText,
                          venueType === type && styles.venueTypeTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Venue Name */}
              <View style={styles.section}>
                <Text style={styles.label}>Venue Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Starbucks Downtown, The Blue Café"
                  value={venueName}
                  onChangeText={setVenueName}
                  placeholderTextColor="#999"
                />
                <Text style={styles.helperText}>
                  💡 Be specific so others can find you
                </Text>
              </View>

              {/* With Friends Toggle */}
              <View style={styles.section}>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleInfo}>
                    <Text style={styles.toggleTitle}>I'm With Friends</Text>
                    <Text style={styles.toggleSubtitle}>
                      Let others know you're part of a group
                    </Text>
                  </View>
                  <Switch
                    value={withFriends}
                    onValueChange={setWithFriends}
                    trackColor={{ false: '#E0E0E0', true: '#FFB3B3' }}
                    thumbColor={withFriends ? '#FF6B6B' : '#F4F4F4'}
                    ios_backgroundColor="#E0E0E0"
                  />
                </View>
              </View>

              {/* Optional Note */}
              <View style={styles.section}>
                <Text style={styles.label}>Additional Note (Optional)</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="e.g. We're at the table near the window, Looking for study buddies"
                  value={tableNote}
                  onChangeText={setTableNote}
                  multiline
                  numberOfLines={3}
                  maxLength={150}
                  placeholderTextColor="#999"
                />
                <Text style={styles.charCount}>{tableNote.length}/150</Text>
              </View>

              {/* Preview Card */}
              <View style={styles.previewSection}>
                <Text style={styles.previewTitle}>Preview</Text>
                <View style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <View style={styles.previewIcon}>
                      <Text style={styles.previewIconText}>🪑</Text>
                    </View>
                    <View style={styles.previewInfo}>
                      <Text style={styles.previewSeats}>
                        {availableSeats} {parseInt(availableSeats) === 1 ? 'Seat' : 'Seats'} Available
                      </Text>
                      <Text style={styles.previewVenue}>
                        📍 {venueName || 'Venue name'} • {venueType}
                      </Text>
                      {withFriends && (
                        <Text style={styles.previewFriends}>👥 With friends</Text>
                      )}
                    </View>
                  </View>
                  {tableNote && (
                    <Text style={styles.previewNote}>"{tableNote}"</Text>
                  )}
                </View>
              </View>
            </>
          )}

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, !isSharingTable && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : isSharingTable ? 'Share My Table' : 'Disable Sharing'}
            </Text>
          </TouchableOpacity>

          {isSharingTable && (
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoText}>
                Your table will be visible in the Discover section. Others can request to join your table via chat.
              </Text>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 15,
  },
  toggleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  seatsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  seatButton: {
    width: 80,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  seatButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  seatButtonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  seatButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  seatButtonTextActive: {
    color: '#FFF',
  },
  venueTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  venueTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  venueTypeButtonActive: {
    backgroundColor: '#FFE0E0',
    borderColor: '#FF6B6B',
  },
  venueTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  venueTypeTextActive: {
    color: '#FF6B6B',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  textArea: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  previewSection: {
    marginTop: 10,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  previewCard: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  previewIconText: {
    fontSize: 24,
  },
  previewInfo: {
    flex: 1,
  },
  previewSeats: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  previewVenue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  previewFriends: {
    fontSize: 13,
    color: '#999',
  },
  previewNote: {
    fontSize: 14,
    color: '#666',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: '#999',
    shadowColor: '#000',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF5E6',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFE0B3',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

