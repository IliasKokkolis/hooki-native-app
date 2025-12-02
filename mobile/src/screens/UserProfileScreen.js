import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import ImageView from 'react-native-image-viewing';

const { width, height } = Dimensions.get('window');
const PHOTO_HEIGHT = height * 0.6;

export default function UserProfileScreen({ route, navigation }) {
  const { user } = route.params;
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photoScrollRef = useRef(null);

  const photos = user.photos || [user.profileImage].filter(Boolean);
  const imageViewerImages = photos.map((uri) => ({ uri }));

  const openImageViewer = (index) => {
    setImageViewerIndex(index);
    setImageViewerVisible(true);
  };

  const onPhotoScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentPhotoIndex(index);
  };

  return (
    <>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Photos Carousel - Tinder Style */}
        {photos.length > 0 && (
          <View style={styles.photosContainer}>
            <ScrollView
              ref={photoScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onPhotoScroll}
              scrollEventThrottle={16}
              style={styles.photoScroll}
            >
              {photos.map((photo, index) => (
                <TouchableOpacity 
                  key={index}
                  activeOpacity={0.95} 
                  onPress={() => openImageViewer(index)}
                  style={styles.photoSlide}
                >
                  <Image source={{ uri: photo }} style={styles.bigPhoto} />
                  <View style={styles.photoGradient}>
                    <View style={styles.photoInfo}>
                      <Text style={styles.photoName}>
                        {user.name}, {user.age}
                      </Text>
                      {user.gender && <Text style={styles.photoGender}>{user.gender}</Text>}
                    </View>
                  </View>
                  {/* Tap to zoom hint */}
                  <View style={styles.zoomHint}>
                    <Text style={styles.zoomHintText}>Tap to zoom 🔍</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Photo dots indicator */}
            {photos.length > 1 && (
              <View style={styles.dotsContainer}>
                {photos.map((_, dotIndex) => (
                  <View
                    key={dotIndex}
                    style={[
                      styles.dot,
                      dotIndex === currentPhotoIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Content below photos */}
        <View style={styles.content}>

        {/* Table Availability Banner */}
        {user.isSharingTable && user.availableSeats > 0 && (
          <View style={styles.tableBanner}>
            <View style={styles.tableBannerHeader}>
              <View style={styles.tableIcon}>
                <Text style={styles.tableIconText}>🪑</Text>
              </View>
              <View style={styles.tableInfo}>
                <Text style={styles.tableSeats}>
                  {user.availableSeats} {user.availableSeats === 1 ? 'Seat' : 'Seats'} Available
                </Text>
                <Text style={styles.tableVenue}>📍 {user.venueName}</Text>
                <Text style={styles.tableType}>{user.venueType}</Text>
                {user.withFriends && (
                  <Text style={styles.tableWithFriends}>👥 With friends</Text>
                )}
              </View>
            </View>
            
            {user.tableNote && (
              <View style={styles.tableNote}>
                <Text style={styles.tableNoteText}>"{user.tableNote}"</Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.requestSeatButton}
              onPress={() =>
                navigation.navigate('Chat', {
                  userId: user.id,
                  userName: user.name,
                })
              }
            >
              <Text style={styles.requestSeatButtonText}>🪑 Request to Join Table</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bio Section */}
        {user.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
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
            <Text style={styles.sectionTitle}>More About {user.name}</Text>
            {user.prompts.map((prompt, index) => (
              <View key={index} style={styles.promptCard}>
                <Text style={styles.promptQuestion}>{prompt.question}</Text>
                <Text style={styles.promptAnswer}>{prompt.answer}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Message Button */}
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() =>
            navigation.navigate('Chat', {
              userId: user.id,
              userName: user.name,
            })
          }
        >
          <Text style={styles.messageButtonText}>💬 Send Message</Text>
        </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
  },
  // Photos Container
  photosContainer: {
    height: PHOTO_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  photoScroll: {
    height: PHOTO_HEIGHT,
  },
  photoSlide: {
    width: width,
    height: PHOTO_HEIGHT,
    position: 'relative',
  },
  bigPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 25,
  },
  photoInfo: {
    marginBottom: 0,
  },
  photoName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  photoGender: {
    fontSize: 18,
    color: '#FFF',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // Photo dots indicator
  dotsContainer: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    zIndex: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    backgroundColor: '#FFF',
    width: 24,
  },
  zoomHint: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  zoomHintText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  // Content below photos
  content: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },
  // Table Availability Banner
  tableBanner: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  tableBannerHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tableIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tableIconText: {
    fontSize: 28,
  },
  tableInfo: {
    flex: 1,
  },
  tableSeats: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  tableVenue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    marginBottom: 3,
  },
  tableType: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  tableWithFriends: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  tableNote: {
    backgroundColor: '#FFF5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  tableNoteText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  requestSeatButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  requestSeatButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    paddingLeft: 5,
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
  messageButton: {
    backgroundColor: '#FF6B6B',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  messageButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


