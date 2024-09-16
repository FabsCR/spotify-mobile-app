import React, { useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { searchPodcasts } from '../services/spotifyAPI.js'; // Asegúrate de que la ruta sea correcta

const SearchPodcast = () => {
  const [query, setQuery] = useState('');
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    console.log(podcasts.id);
    setLoading(true);
    const results = await searchPodcasts(query);
    setPodcasts(results);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Campo de búsqueda */}
      <TextInput
        style={styles.input}
        placeholder="Search for podcasts"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={handleSearch} />

      {/* Indicador de carga */}
      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      {/* Lista de podcasts */}
      <FlatList
        data={podcasts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
           console.log('ID del podcast:', item.id),
          <View style={styles.podcastContainer}>
            {/* Nombre del podcast */}
            <Text style={styles.podcastName}>{item.name}</Text>

            {/* Imagen del podcast */}
            <Image
              source={{ uri: item.images[0]?.url }}
              style={styles.podcastImage}
            />

            {/* Descripción del podcast */}
            <Text style={styles.description}>{item.description}</Text>

            {/* Total de episodios */}
            <Text style={styles.episodes}>
              Episodes: {item.total_episodes}
            </Text>

            {/* Publisher */}
            <Text style={styles.publisher}>
              Publisher: {item.publisher}
            </Text>
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
  podcastContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  podcastName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  podcastImage: {
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
  description: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
  },
  episodes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  publisher: {
    fontSize: 14,
    color: '#666',
  },
});

export default SearchPodcast;
