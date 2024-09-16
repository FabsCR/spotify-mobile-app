import React, { useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { searchAlbums } from '../services/spotifyAPI.js'; // Asegúrate de que la ruta sea correcta

const SearchAlbum = () => {
  const [query, setQuery] = useState('');
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const results = await searchAlbums(query);
      setAlbums(results);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Campo de búsqueda */}
      <TextInput
        style={styles.input}
        placeholder="Search for albums"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={handleSearch} />

      {/* Indicador de carga */}
      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      {/* Lista de álbumes */}
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.albumContainer}>
            {/* Nombre del álbum */}
            <Text style={styles.albumName}>{item.name}</Text>
            
            {/* Imagen del álbum */}
            <Image
              source={{ uri: item.images[0]?.url }}
              style={styles.albumImage}
            />
            
            {/* Artista */}
            <Text style={styles.artistName}>{item.artists[0]?.name}</Text>
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
  albumContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  albumName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  albumImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});

export default SearchAlbum;
