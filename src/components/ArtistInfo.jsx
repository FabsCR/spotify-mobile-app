import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { getArtistInfo } from '../services/spotifyAPI.js';
import axios from 'axios';

const ArtistInfo = ({ artistId }) => {
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      const artistData = await getArtistInfo(artistId);
      setArtist(artistData);
    };

    fetchArtist();
  }, [artistId]);

  if (!artist) return <Text>Cargando...</Text>;

  return (
    <View style={styles.container}>
      {/* Nombre del artista */}
      <Text style={styles.artistName}>{artist.name}</Text>
      
      {/* Imagen del artista */}
      <Image 
        source={{ uri: artist.images[0]?.url }} 
        style={styles.artistImage} 
      />
      
      {/* Géneros musicales */}
      <View style={styles.genreContainer}>
        <Text style={styles.sectionTitle}>Géneros</Text>
        <Text style={styles.genres}>{artist.genres.join(', ')}</Text>
      </View>

      {/* Popularidad con barra de progreso personalizada */}
      <View style={styles.popularityContainer}>
        <Text style={styles.sectionTitle}>Popularidad</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBar, { width: `${artist.popularity}%` }]} />
        </View>
        <Text style={styles.popularityText}>{artist.popularity}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    margin: 15,
  },
  artistName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  artistImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  genreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  genres: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#444',
    textAlign: 'center',
  },
  popularityContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  progressBarBackground: {
    width: 220,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1DB954', // Verde de Spotify
  },
  popularityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default ArtistInfo;

