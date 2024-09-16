import React, { useState } from 'react';
import { Text, View, TextInput, Button, Image, FlatList, StyleSheet } from 'react-native';
import { searchArtists } from '../services/spotifyAPI.js'; // Asegúrate de que la ruta sea correcta

const SearchArtists = () => {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    const results = await searchArtists(query);
    setArtists(results);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Campo de búsqueda */}
      <TextInput
        style={styles.input}
        placeholder="Search for artists"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={handleSearch} />

      {/* Indicador de carga */}
      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      {/* Lista de artistas */}
      <FlatList
        data={artists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.artistContainer}>
            {/* Nombre del artista */}
            <Text style={styles.artistName}>{item.name}</Text>
            
            {/* Imagen del artista */}
            <Image
              source={{ uri: item.images[0]?.url }}
              style={styles.artistImage}
            />
            
            {/* Géneros musicales */}
            <View style={styles.genreContainer}>
              <Text style={styles.sectionTitle}>Genres</Text>
              <Text style={styles.genres}>{item.genres.join(', ')}</Text>
            </View>

            {/* Popularidad con barra de progreso personalizada */}
            <View style={styles.popularityContainer}>
              <Text style={styles.sectionTitle}>Popularity</Text>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBar, { width: `${item.popularity}%` }]} />
              </View>
              <Text style={styles.popularityText}>{item.popularity}%</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  artistContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  artistName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  genreContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  genres: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#444',
    textAlign: 'center',
  },
  popularityContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  progressBarBackground: {
    width: 200,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1DB954', // Verde de Spotify
  },
  popularityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default SearchArtists;
