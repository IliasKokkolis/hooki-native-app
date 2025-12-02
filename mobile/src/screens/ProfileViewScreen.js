import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ProfileViewScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  if (!user) return null;

  const photos = user.photos || [user.profileImage].filter(Boolean);
  const mainPhoto = photos[0];
  const additionalPhotos = photos.slice(1);
  const imageViewerImages = photos.map(uri => ({ uri }));

  const openImageViewer = (index) => {
    setImageViewerIndex(index);
    setImageViewerVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const storedUser = await AsyncStorage.getItem('user');
    } catch (error) {
      console.error('Error refreshing:', error);
    }
    setRefreshing(false);
  };

  return (
    <>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B6B']} />
        }
      >
        {/* Main Profile Photo - Large Circular */}
        {mainPhoto && (
          <View style={styles.mainPhotoSection}>
            <TouchableOpacity 
              onPress={() => openImageViewer(0)} 
              activeOpacity={0.9}
              style={styles.mainPhotoTouchable}
            >
              <View style={styles.mainPhotoWrapper}>
                <Image source={{ uri: mainPhoto }} style={styles.mainProfilePhoto} />
                <View style={styles.mainPhotoIconOverlay}>
                  <Text style={styles.expandIcon}>🔍</Text>
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.mainPhotoHint}>Tap to view full size</Text>
          </View>
        )}

        {/* Profile Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{user.name}, {user.age}</Text>
          {user.gender && <Text style={styles.gender}>{user.gender}</Text>}
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Additional Photos - Square Grid */}
        {additionalPhotos.length > 0 && (
          <View style={styles.additionalPhotosSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📸 More Photos</Text>
              <Text style={styles.photoCount}>
                {additionalPhotos.length} photo{additionalPhotos.length > 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.photosGrid}>
              {additionalPhotos.map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.squarePhotoContainer}
                  onPress={() => openImageViewer(index + 1)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: photo }} style={styles.squarePhoto} />
                  <View style={styles.photoOverlay}>
                    <View style={styles.expandIconSmall}>
                      <Text style={styles.expandIconSmallText}>🔍</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

      {/* Bio Section */}
      {user.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <View style={styles.card}>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        </View>
      )}

      {/* Interests Section */}
      {user.interests && user.interests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {user.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Prompts Section */}
      {user.prompts && user.prompts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Prompts</Text>
          {user.prompts.map((prompt, index) => (
            <View key={index} style={styles.promptCard}>
              <Text style={styles.promptQuestion}>{prompt.question}</Text>
              <Text style={styles.promptAnswer}>{prompt.answer}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>{user.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member Since:</Text>
            <Text style={styles.infoValue}>
              {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Profile Status:</Text>
            <Text style={[styles.infoValue, styles.statusComplete]}>
              ✓ Complete
            </Text>
          </View>
        </View>
      </View>

          {/* Table Status Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Table Status</Text>
            <TouchableOpacity
              style={styles.tableCard}
              onPress={() => navigation.navigate('TableAvailability')}
            >
              <View style={styles.tableCardContent}>
                <View style={styles.tableCardIcon}>
                  <Text style={styles.tableCardIconText}>🪑</Text>
                </View>
                <View style={styles.tableCardInfo}>
                  {user.isSharingTable ? (
                    <>
                      <Text style={styles.tableCardTitle}>Table Active</Text>
                      <Text style={styles.tableCardSubtitle}>
                        {user.availableSeats} {user.availableSeats === 1 ? 'seat' : 'seats'} at {user.venueName}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.tableCardTitle}>No Active Table</Text>
                      <Text style={styles.tableCardSubtitle}>
                        Tap to share your table
                      </Text>
                    </>
                  )}
                </View>
                <Text style={styles.tableCardArrow}>›</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💾 All data stored locally on your device
        </Text>
      </View>
      </ScrollView>

      {/* Image Viewer Modal */}
      <ImageView
        images={imageViewerImages}
        imageIndex={imageViewerIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    paddingBottom: 40,
  },
  // Main Profile Photo Styles
  mainPhotoSection: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mainPhotoTouchable: {
    marginBottom: 12,
  },
  mainPhotoWrapper: {
    position: 'relative',
  },
  mainProfilePhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 6,
    borderColor: '#FF6B6B',
  },
  mainPhotoIconOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FF6B6B',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  expandIcon: {
    fontSize: 20,
  },
  mainPhotoHint: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  // Profile Header
  header: {
    backgroundColor: '#FFF',
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  gender: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  // Additional Photos Section
  additionalPhotosSection: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  photoCount: {
    fontSize: 13,
    color: '#999',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  squarePhotoContainer: {
    width: (width - 64) / 3,
    aspectRatio: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    position: 'relative',
  },
  squarePhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  expandIconSmall: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIconSmallText: {
    fontSize: 14,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bioText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  promptCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  promptQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  promptAnswer: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  statusComplete: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  tableCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  tableCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  tableCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tableCardIconText: {
    fontSize: 24,
  },
  tableCardInfo: {
    flex: 1,
  },
  tableCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  tableCardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  tableCardArrow: {
    fontSize: 32,
    color: '#CCC',
    fontWeight: '300',
  },
  actions: {
    gap: 10,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  signOutButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

