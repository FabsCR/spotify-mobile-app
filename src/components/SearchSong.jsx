import React, { useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { searchSongs } from '../services/spotifyAPI.js'; // Asegúrate de que la ruta sea correcta

const SearchSong = () => {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const results = await searchSongs(query);
      setSongs(results);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Campo de búsqueda */}
      <TextInput
        style={styles.input}
        placeholder="Search for songs"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={handleSearch} />

      {/* Indicador de carga */}
      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      {/* Lista de canciones */}
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.songContainer}>
            {/* Nombre de la canción */}
            <Text style={styles.songName}>{item.name}</Text>

            {/* Imagen del álbum */}
            <Image
              source={{ uri: item.album.images[0]?.url }}
              style={styles.albumImage}
            />

            {/* Artista */}
            <Text style={styles.artist}>
              Artist: {item.artists.map(artist => artist.name).join(', ')}
            </Text>

            {/* Álbum */}
            <Text style={styles.album}>
              Album: {item.album.name}
            </Text>

            {/* Duración de la canción */}
            <Text style={styles.duration}>
              Duration: {(item.duration_ms / 1000 / 60).toFixed(2)} min
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
  songContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  songName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  albumImage: {
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
  artist: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
  },
  album: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
});

export default SearchSong;
