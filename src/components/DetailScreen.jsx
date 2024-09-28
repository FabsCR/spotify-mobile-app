import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DetailScreen = ({ route }) => {
  const { item } = route.params;

  // Verifica si item existe
  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item not found.</Text>
      </View>
    );
  }

  const handleListenPreview = () => {
    if (item.preview_url) {
      Linking.openURL(item.preview_url); // Abre la URL de preview en el navegador
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
              <Image 
          source={{ uri: item.album?.images?.[0]?.url || item.images?.[0]?.url }} 
          style={styles.image} 
        />

        {/* Información del artista */}
        {item.followers && (
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Followers:</Text>
            <Text style={styles.infoValue}>{item.followers.total?.toLocaleString() || 'N/A'}</Text>
          </View>
        )}

        {item.genres && item.genres.length > 0 && (
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Genres:</Text>
            <Text style={styles.infoValue}>{item.genres.join(', ')}</Text>
          </View>
        )}

        {item.popularity !== undefined && (
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Popularity:</Text>
            <Text style={styles.infoValue}>{item.popularity}</Text>
          </View>
        )}

        {item.album && (
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Album:</Text>
            <Text style={styles.infoValue}>{item.album.name || 'N/A'}</Text>
          </View>
        )}

        {item.release_date && (
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Release Date:</Text>
            <Text style={styles.infoValue}>{new Date(item.release_date).toLocaleDateString() || 'N/A'}</Text>
          </View>
        )}

        {item.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}

        {/* Información del programa */}
        {item.publisher && (
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Publisher:</Text>
            <Text style={styles.infoValue}>{item.publisher || 'N/A'}</Text>
          </View>
        )}

        {item.total_episodes !== undefined && (
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Total Episodes:</Text>
            <Text style={styles.infoValue}>{item.total_episodes}</Text>
          </View>
        )}

        {item.languages && item.languages.length > 0 && (
          <View style={styles.infoContainer}>
            <Text style={styles.info}>Languages:</Text>
            <Text style={styles.infoValue}>{item.languages.join(', ')}</Text>
          </View>
        )}

        {/* Información de la canción */}
        {item.name && item.duration_ms ? (
          <View style={styles.trackContainer}>
            <Text style={styles.trackTitle}>Track: {item.name}</Text>
            <Text style={styles.trackDuration}>
              Duration: {Math.floor(item.duration_ms / 60000)}:{('0' + Math.floor((item.duration_ms % 60000) / 1000)).slice(-2)} min
            </Text>
            <Text style={styles.trackPopularity}>Popularity: {item.popularity}</Text>

            {/* Botón Play Test */}
            {item.preview_url && (
              <TouchableOpacity style={styles.playButton} onPress={handleListenPreview}>
                <Text style={styles.playButtonText}>Play Test</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.noTrackMessage}>No song details available.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  card: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    width: '90%',
    marginVertical: 20,
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: '#bbb',
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  trackContainer: {
    marginTop: 20,
    width: '100%',
  },
  trackTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  trackDuration: {
    fontSize: 16,
    color: '#fff',
  },
  trackPopularity: {
    fontSize: 16,
    color: '#fff',
  },
  noTrackMessage: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
  },
  playButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1DB954', // Color verde de Spotify
    borderRadius: 8,
  },
  playButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DetailScreen;
