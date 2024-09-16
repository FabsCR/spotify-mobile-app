import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { getPodcastInfo } from '../services/spotifyAPI'; // Ruta a tu API de servicios de Spotify

const PodcastInfo = ({ podcastId }) => {
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      const podcastData = await getPodcastInfo(podcastId);
      setPodcast(podcastData);
    };

    fetchPodcast();
  }, [podcastId]);

  if (!podcast) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      {/* Nombre del podcast */}
      <Text style={styles.podcastName}>{podcast.name}</Text>
      
      {/* Imagen del podcast */}
      <Image 
        source={{ uri: podcast.images[0]?.url }} 
        style={styles.podcastImage} 
      />
      
      {/* Descripción del podcast */}
      <Text style={styles.description}>{podcast.description}</Text>
      
      {/* Número de episodios */}
      <Text style={styles.episodes}>Episodes: {podcast.total_episodes}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    margin: 15,
  },
  podcastName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  podcastImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
  episodes: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default PodcastInfo;
