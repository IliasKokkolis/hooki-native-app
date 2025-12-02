import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

const DATING_PROMPTS = [
  "My ideal first date...",
  "I'm looking for...",
  "My love language is...",
  "You should know that I...",
  "My perfect weekend includes...",
  "I geek out on...",
  "My simple pleasures...",
  "I won't shut up about...",
];

const MAX_PHOTOS = 6;

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  // Initialize with existing user data
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [photos, setPhotos] = useState(user.photos || [user.profileImage].filter(Boolean));
  const [age, setAge] = useState(user.age?.toString() || '');
  const [gender, setGender] = useState(user.gender || '');
  const [bio, setBio] = useState(user.bio || '');
  const [interests, setInterests] = useState(user.interests?.join(', ') || '');
  
  // Table/Location data
  const [availableSeats, setAvailableSeats] = useState(user.availableSeats?.toString() || '0');
  const [tableLocation, setTableLocation] = useState(user.tableLocation || '');
  
  // Prompts
  const [prompt1, setPrompt1] = useState(user.prompts?.[0]?.question || DATING_PROMPTS[0]);
  const [answer1, setAnswer1] = useState(user.prompts?.[0]?.answer || '');
  const [prompt2, setPrompt2] = useState(user.prompts?.[1]?.question || DATING_PROMPTS[1]);
  const [answer2, setAnswer2] = useState(user.prompts?.[1]?.answer || '');
  const [prompt3, setPrompt3] = useState(user.prompts?.[2]?.question || DATING_PROMPTS[2]);
  const [answer3, setAnswer3] = useState(user.prompts?.[2]?.answer || '');

  const pickImage = async (index) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.7,
      });

      if (!result.canceled) {
        const newPhotos = [...photos];
        newPhotos[index] = result.assets[0].uri;
        setPhotos(newPhotos);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removePhoto = (index) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newPhotos = photos.filter((_, i) => i !== index);
            setPhotos(newPhotos);
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Info Required', 'Please fill in your name and email');
      return;
    }

    if (photos.length === 0) {
      Alert.alert('Photo Required', 'Please add at least one photo');
      return;
    }

    if (!age || !gender) {
      Alert.alert('Info Required', 'Please fill in your age and gender');
      return;
    }

    if (!bio) {
      Alert.alert('Bio Required', 'Please write a short bio');
      return;
    }

    if (!answer1 || !answer2 || !answer3) {
      Alert.alert('Prompts Required', 'Please answer all three prompts');
      return;
    }

    setLoading(true);
    
    const profileData = {
      name,
      email: email.toLowerCase(),
      photos,
      profileImage: photos[0], // First photo is main profile image
      age: parseInt(age),
      gender,
      bio,
      interests: interests.split(',').map(i => i.trim()).filter(i => i),
      prompts: [
        { question: prompt1, answer: answer1 },
        { question: prompt2, answer: answer2 },
        { question: prompt3, answer: answer3 },
      ],
      availableSeats: parseInt(availableSeats) || 0,
      tableLocation: tableLocation.trim(),
      profileComplete: true,
    };

    const result = await updateProfile(profileData);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to update profile');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Photos Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos ({photos.length}/{MAX_PHOTOS})</Text>
            <Text style={styles.sectionSubtitle}>Add up to 6 photos</Text>
            
            <View style={styles.photosGrid}>
              {Array.from({ length: MAX_PHOTOS }).map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.photoSlot}
                  onPress={() => pickImage(index)}
                  onLongPress={() => photos[index] && removePhoto(index)}
                >
                  {photos[index] ? (
                    <>
                      <Image source={{ uri: photos[index] }} style={styles.photo} />
                      {index === 0 && (
                        <View style={styles.mainBadge}>
                          <Text style={styles.mainBadgeText}>Main</Text>
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removePhoto(index)}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Text style={styles.photoPlaceholderText}>+</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.helperText}>
              Tap to add/change • Long press to remove
            </Text>
          </View>

          {/* Personal Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
            
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderButtons}>
              {['Male', 'Female', 'Other'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderButton,
                    gender === option && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender(option)}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === option && styles.genderButtonTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Interests (comma separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Coffee, Music, Travel"
              value={interests}
              onChangeText={setInterests}
              placeholderTextColor="#999"
            />
          </View>

          {/* Bio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write something interesting about yourself..."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              maxLength={200}
              placeholderTextColor="#999"
            />
            <Text style={styles.charCount}>{bio.length}/200</Text>
          </View>

          {/* Table & Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🪑 Share Your Table</Text>
            <Text style={styles.sectionSubtitle}>
              Let others know if you have available seats at your table
            </Text>

            <Text style={styles.label}>Available Seats</Text>
            <View style={styles.seatsButtons}>
              {[0, 1, 2, 3, 4, 5].map((seatNum) => (
                <TouchableOpacity
                  key={seatNum}
                  style={[
                    styles.seatButton,
                    availableSeats === seatNum.toString() && styles.seatButtonActive,
                  ]}
                  onPress={() => setAvailableSeats(seatNum.toString())}
                >
                  <Text
                    style={[
                      styles.seatButtonText,
                      availableSeats === seatNum.toString() && styles.seatButtonTextActive,
                    ]}
                  >
                    {seatNum === 0 ? 'None' : seatNum}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {parseInt(availableSeats) > 0 && (
              <>
                <Text style={styles.label}>Where are you? (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Starbucks Downtown, Corner table"
                  value={tableLocation}
                  onChangeText={setTableLocation}
                  placeholderTextColor="#999"
                />
                <Text style={styles.helperTextSmall}>
                  💡 Add your location so others can find you easily
                </Text>
              </>
            )}
          </View>

          {/* Dating Prompts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dating Prompts</Text>
            
            <View style={styles.promptCard}>
              <Text style={styles.promptQuestion}>{prompt1}</Text>
              <TextInput
                style={[styles.input, styles.promptAnswer]}
                placeholder="Your answer..."
                value={answer1}
                onChangeText={setAnswer1}
                multiline
                numberOfLines={2}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.promptCard}>
              <Text style={styles.promptQuestion}>{prompt2}</Text>
              <TextInput
                style={[styles.input, styles.promptAnswer]}
                placeholder="Your answer..."
                value={answer2}
                onChangeText={setAnswer2}
                multiline
                numberOfLines={2}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.promptCard}>
              <Text style={styles.promptQuestion}>{prompt3}</Text>
              <TextInput
                style={[styles.input, styles.promptAnswer]}
                placeholder="Your answer..."
                value={answer3}
                onChangeText={setAnswer3}
                multiline
                numberOfLines={2}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoSlot: {
    width: '31%',
    aspectRatio: 3/4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 32,
    color: '#999',
  },
  mainBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  mainBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  helperTextSmall: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: -10,
    marginBottom: 10,
  },
  seatsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  seatButton: {
    flex: 1,
    minWidth: 50,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  seatButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  seatButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  seatButtonTextActive: {
    color: '#FFF',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    color: '#999',
    fontSize: 12,
    marginTop: -10,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  genderButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  genderButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  genderButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  genderButtonTextActive: {
    color: '#FFF',
  },
  promptCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  promptQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  promptAnswer: {
    marginBottom: 0,
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
