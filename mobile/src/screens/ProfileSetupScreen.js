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

export default function ProfileSetupScreen() {
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Profile data
  const [photos, setPhotos] = useState([]);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  
  // Prompts (3 prompts with answers)
  const [prompt1, setPrompt1] = useState(DATING_PROMPTS[0]);
  const [answer1, setAnswer1] = useState('');
  const [prompt2, setPrompt2] = useState(DATING_PROMPTS[1]);
  const [answer2, setAnswer2] = useState('');
  const [prompt3, setPrompt3] = useState(DATING_PROMPTS[2]);
  const [answer3, setAnswer3] = useState('');

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
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handleNext = () => {
    if (step === 1 && photos.length === 0) {
      Alert.alert('Photo Required', 'Please add at least one photo');
      return;
    }
    if (step === 2 && (!age || !gender)) {
      Alert.alert('Info Required', 'Please fill in your age and gender');
      return;
    }
    if (step === 3 && !bio) {
      Alert.alert('Bio Required', 'Please write a short bio');
      return;
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    if (!answer1 || !answer2 || !answer3) {
      Alert.alert('Prompts Required', 'Please answer all three prompts');
      return;
    }

    setLoading(true);
    
    const profileData = {
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
      profileComplete: true,
    };

    await updateProfile(profileData);
    setLoading(false);
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Add Your Photos</Text>
      <Text style={styles.stepSubtitle}>Add up to {MAX_PHOTOS} photos ({photos.length}/{MAX_PHOTOS})</Text>

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
        Tap to add • Long press to remove • First photo is your main profile photo
      </Text>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Info</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <View style={styles.form}>
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
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Bio</Text>
      <Text style={styles.stepSubtitle}>What makes you unique?</Text>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write something interesting about yourself..."
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />
        <Text style={styles.charCount}>{bio.length}/200</Text>
      </View>
    </View>
  );

  const renderPromptSelector = (currentPrompt, setPrompt) => (
    <View style={styles.promptSelector}>
      {DATING_PROMPTS.map((prompt) => (
        <TouchableOpacity
          key={prompt}
          style={[
            styles.promptOption,
            currentPrompt === prompt && styles.promptOptionActive,
          ]}
          onPress={() => setPrompt(prompt)}
        >
          <Text
            style={[
              styles.promptOptionText,
              currentPrompt === prompt && styles.promptOptionTextActive,
            ]}
          >
            {prompt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Dating Prompts</Text>
      <Text style={styles.stepSubtitle}>Answer 3 prompts to show your personality</Text>

      <View style={styles.form}>
        {/* Prompt 1 */}
        <View style={styles.promptCard}>
          <TouchableOpacity onPress={() => setStep(4.1)}>
            <Text style={styles.promptQuestion}>{prompt1}</Text>
          </TouchableOpacity>
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

        {/* Prompt 2 */}
        <View style={styles.promptCard}>
          <TouchableOpacity onPress={() => setStep(4.2)}>
            <Text style={styles.promptQuestion}>{prompt2}</Text>
          </TouchableOpacity>
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

        {/* Prompt 3 */}
        <View style={styles.promptCard}>
          <TouchableOpacity onPress={() => setStep(4.3)}>
            <Text style={styles.promptQuestion}>{prompt3}</Text>
          </TouchableOpacity>
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
    </View>
  );

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
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                Math.floor(step) >= s && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {/* Render current step */}
        {Math.floor(step) === 1 && renderStep1()}
        {Math.floor(step) === 2 && renderStep2()}
        {Math.floor(step) === 3 && renderStep3()}
        {Math.floor(step) === 4 && (
          <>
            {step === 4.1 && renderPromptSelector(prompt1, (p) => { setPrompt1(p); setStep(4); })}
            {step === 4.2 && renderPromptSelector(prompt2, (p) => { setPrompt2(p); setStep(4); })}
            {step === 4.3 && renderPromptSelector(prompt3, (p) => { setPrompt3(p); setStep(4); })}
            {step === 4 && renderStep4()}
          </>
        )}

        {/* Navigation buttons */}
        <View style={styles.buttonContainer}>
          {step > 1 && Math.floor(step) === step && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep(step - 1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          {Math.floor(step) < 4 && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          )}

          {Math.floor(step) === 4 && step === 4 && (
            <TouchableOpacity
              style={[styles.nextButton, loading && styles.buttonDisabled]}
              onPress={handleComplete}
              disabled={loading}
            >
              <Text style={styles.nextButtonText}>
                {loading ? 'Saving...' : 'Complete Profile'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 10,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#FFF',
  },
  stepContainer: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 20,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
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
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderStyle: 'dashed',
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
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
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
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  genderButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  genderButtonTextActive: {
    color: '#FFF',
  },
  promptCard: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  promptQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  promptAnswer: {
    marginBottom: 0,
  },
  promptSelector: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  promptOption: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  promptOptionActive: {
    backgroundColor: '#FF6B6B',
  },
  promptOptionText: {
    fontSize: 16,
    color: '#333',
  },
  promptOptionTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
