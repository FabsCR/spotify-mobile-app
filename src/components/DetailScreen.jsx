import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DetailScreen = ({ route }) => {
  const { item } = route.params;
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Progreso de la canción
  const [duration, setDuration] = useState(0); // Duración total de la canción

  // Verifica si item existe
  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item not found.</Text>
      </View>
    );
  }

  const handleListenPreview = async () => {
    if (item.preview_url) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: item.preview_url },
        { shouldPlay: true }
      );
      setSound(sound);
      setIsPlaying(true);

      // Obtener la duración total de la canción
      const status = await sound.getStatusAsync();
      setDuration(status.durationMillis);

      // Actualizar el progreso de la canción
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setProgress(status.positionMillis);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setProgress(0); // Reiniciar el progreso cuando termine
            sound.unloadAsync(); // Liberar el sonido después de terminar
          }
        }
      });

      await sound.playAsync();
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying && sound) {
      // Configura un intervalo para actualizar el progreso cada 100 ms
      interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setProgress(status.positionMillis);
        }
      }, 100);
    }
    
    // Limpieza del intervalo al desmontar el componente o detener el sonido
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, sound]);

  const handleStopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      sound.unloadAsync(); // Liberar el sonido después de detenerlo
      setSound(null); // Limpiar el estado
      setIsPlaying(false);
      setProgress(0); // Reiniciar el progreso
    }
  };

  const handleSeek = async (value) => {
    if (sound) {
      const seekToMillis = value;
      await sound.setPositionAsync(seekToMillis);
      setProgress(seekToMillis);
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

        {/* Otras secciones de información... */}

        {/* Información de la canción */}
        {item.name && item.duration_ms ? (
          <View style={styles.trackContainer}>
            <Text style={styles.trackTitle}>Song: {item.name}</Text>
            <Text style={styles.trackDuration}>
              Duration: {Math.floor(item.duration_ms / 60000)}:{('0' + Math.floor((item.duration_ms % 60000) / 1000)).slice(-2)} min
            </Text>
            <Text style={styles.trackPopularity}>Popularity: {item.popularity}</Text>

            {/* Barra de progreso */}
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={progress}
              onValueChange={handleSeek}
              minimumTrackTintColor="#1DB954" // Color verde de Spotify
              maximumTrackTintColor="#fff"
            />
            <Text style={styles.progressText}>
              {Math.floor(progress / 60000)}:{('0' + Math.floor((progress % 60000) / 1000)).slice(-2)} / 
              {Math.floor(duration / 60000)}:{('0' + Math.floor((duration % 60000) / 1000)).slice(-2)}
            </Text>

            {/* Botón Play Test */}
            {item.preview_url && !isPlaying && (
              <TouchableOpacity style={styles.playButton} onPress={handleListenPreview}>
                <Text style={styles.playButtonText}>Play Test</Text>
              </TouchableOpacity>
            )}
            {/* Botón Stop */}
            {isPlaying && (
              <TouchableOpacity style={styles.stopButton} onPress={handleStopSound}>
                <Text style={styles.stopButtonText}>Stop</Text>
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
    backgroundColor: '#1DB954', // Color verde de Spotify
    borderRadius: 8,
  },
  playButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  stopButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF0000', // Color rojo para el botón de detener
    borderRadius: 8,
  },
  stopButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DetailScreen;
