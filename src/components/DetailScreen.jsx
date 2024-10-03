import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { getAlbumTracks, searchAlbums, searchSongs, saveTrack, removeTrack, followArtist, unfollowArtist } from '../services/spotifyAPI';
import { SPOTIFY_ACCESS_TOKEN } from '@env';
import * as SecureStore from 'expo-secure-store';

const DetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (item.type === 'artist') {
      fetchArtistDetails();
    } else if (item.type === 'album') {
      fetchAlbumTracks();
    } else if (item.type === 'track' || item.type === 'show') {
      setLoading(false);
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [item]);

  const fetchArtistDetails = async () => {
    try {
      const albumsResult = await searchAlbums(item.name);
      const songsResult = await searchSongs(item.name);
      setAlbums(albumsResult);
      setSongs(songsResult);
    } catch (error) {
      console.error('Error fetching artist details', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbumTracks = async () => {
    try {
      const albumTracks = await getAlbumTracks(item.id);
      setTracks(albumTracks);
    } catch (error) {
      console.error('Error fetching album tracks', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserAccessToken = async () => {
    return await SecureStore.getItemAsync('spotify_token');
  };

  const handleListenPreview = async () => {
    try {
      if (item.preview_url) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: item.preview_url },
          { shouldPlay: true }
        );
        setSound(sound);
        setIsPlaying(true);

        const status = await sound.getStatusAsync();
        setDuration(status.durationMillis);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setProgress(status.positionMillis);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setProgress(0);
              sound.unloadAsync();
            }
          }
        });

        await sound.playAsync();
      } else {
        alert('No preview available');
      }
    } catch (error) {
      console.error('Error playing preview', error);
    }
  };

  const handleStopSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        setProgress(0);
      }
    } catch (error) {
      console.error('Error stopping sound', error);
    }
  };

  const handleSaveSong = async () => {
    const token = await getUserAccessToken(); // Obtener access token del usuario
    if (!token) {
      console.error('No access token found');
      return;
    }

    if (isSaved) {
      await removeTrack(item.id, token);  // Usa el access token del usuario
    } else {
      await saveTrack(item.id, token);  // Usa el access token del usuario
    }
    setIsSaved(!isSaved);
  };

  const handleFollowArtist = async () => {
    const token = await getUserAccessToken(); // Obtener access token del usuario
    if (!token) {
      console.error('No access token found');
      return;
    }

    if (isFollowing) {
      await unfollowArtist(item.id, token);  // Usa el access token del usuario
    } else {
      await followArtist(item.id, token);  // Usa el access token del usuario
    }
    setIsFollowing(!isFollowing);
  };

  const renderHeader = () => (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <Image 
        source={{ uri: item.album?.images?.[0]?.url || item.images?.[0]?.url }} 
        style={styles.image} 
      />
      {item.type === 'artist' && (
        <>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>Followers: {item.followers.total.toLocaleString()}</Text>
          <Text style={styles.subtitle}>Genres: {item.genres.join(', ')}</Text>

          {/* Botón para Seguir/Dejar de seguir artista */}
          <TouchableOpacity onPress={handleFollowArtist} style={styles.button}>
            <Text style={styles.buttonText}>
              {isFollowing ? 'Unfollow Artist' : 'Follow Artist'}
            </Text>
          </TouchableOpacity>
        </>
      )}
      {item.type === 'album' && (
        <>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>Release Date: {item.release_date}</Text>
          <Text style={styles.subtitle}>Total Tracks: {item.total_tracks}</Text>
        </>
      )}
      {item.type === 'track' && (
        <>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>
            Duration: {Math.floor(item.duration_ms / 60000)}:{Math.floor((item.duration_ms % 60000) / 1000)}
          </Text>
          <Text style={styles.subtitle}>Popularity: {item.popularity}</Text>

          {/* Barra de Progreso */}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={progress}
            onValueChange={handleStopSound}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#fff"
          />
          <Text style={styles.progressText}>
            {Math.floor(progress / 60000)}:{('0' + Math.floor((progress % 60000) / 1000)).slice(-2)} / 
            {Math.floor(duration / 60000)}:{('0' + Math.floor((duration % 60000) / 1000)).slice(-2)}
          </Text>

          {/* Botón Play */}
          {item.preview_url && !isPlaying && (
            <TouchableOpacity style={styles.playButton} onPress={handleListenPreview}>
              <Text style={styles.playButtonText}>Play Preview</Text>
            </TouchableOpacity>
          )}

          {/* Botón Stop */}
          {isPlaying && (
            <TouchableOpacity style={styles.stopButton} onPress={handleStopSound}>
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          )}

          {/* Botón para Guardar/Quitar canciones */}
          <TouchableOpacity onPress={handleSaveSong} style={styles.button}>
            <Text style={styles.buttonText}>
              {isSaved ? 'Remove from Library' : 'Save to Library'}
            </Text>
          </TouchableOpacity>
        </>
      )}
      {item.type === 'show' && (
        <>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>Publisher: {item.publisher}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </>
      )}
    </Animated.View>
  );

  const renderAlbums = ({ item: album }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Details', { item: album })}>
      <View style={styles.albumContainer}>
        <Image source={{ uri: album.images[0].url }} style={styles.albumImage} />
        <Text style={styles.albumTitle}>{album.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTracks = ({ item: track }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Details', { item: track })}>
      <View style={styles.songContainer}>
        <Text style={styles.songTitle}>{track.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <FlatList
      data={item.type === 'artist' ? albums : tracks}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      renderItem={item.type === 'artist' ? renderAlbums : renderTracks}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  card: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#bbb',
    marginBottom: 5,
    textAlign: 'center',
  },
  albumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  albumImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  albumTitle: {
    fontSize: 16,
    color: '#fff',
  },
  songContainer: {
    marginBottom: 10,
  },
  songTitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 10,
  },
  progressText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  playButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1DB954',
    borderRadius: 8,
  },
  playButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stopButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF0000',
    borderRadius: 8,
  },
  stopButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1DB954',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default DetailScreen;