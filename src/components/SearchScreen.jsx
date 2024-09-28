import React, { useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { searchAlbums, searchArtists, searchPodcasts, searchSongs } from '../services/spotifyAPI.js';

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    artists: [],
    albums: [],
    songs: [],
    podcasts: []
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const [artistResults, albumResults, songResults, podcastResults] = await Promise.all([
        searchArtists(query),
        searchAlbums(query),
        searchSongs(query),
        searchPodcasts(query)
      ]);
      setResults({
        artists: artistResults,
        albums: albumResults,
        songs: songResults,
        podcasts: podcastResults
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (item) => {
    // Log item to see what data is being passed
    console.log('Navigating to Details with item:', item);
    navigation.navigate('Details', { item });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for artists, albums, songs or podcasts"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        query !== '' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Artistas */}
            {results.artists.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Artists</Text>
                <FlatList
                  data={results.artists}
                  horizontal
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleNavigation(item)}>
                      <View style={styles.resultContainer}>
                        <Image source={{ uri: item.images?.[0]?.url || 'default-image-url.jpg' }} style={styles.resultImage} />
                        <Text style={styles.resultName}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}

            {/* Álbumes */}
            {results.albums.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Albums</Text>
                <FlatList
                  data={results.albums}
                  horizontal
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleNavigation(item)}>
                      <View style={styles.resultContainer}>
                        <Image source={{ uri: item.images?.[0]?.url || 'default-image-url.jpg' }} style={styles.resultImage} />
                        <Text style={styles.resultName}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}

            {/* Canciones */}
            {results.songs.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Songs</Text>
                <FlatList
                  data={results.songs}
                  horizontal
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleNavigation(item)}>
                      <View style={styles.resultContainer}>
                        <Image source={{ uri: item.album.images?.[0]?.url || 'default-image-url.jpg' }} style={styles.resultImage} />
                        <Text style={styles.resultName}>{item.name}</Text>
                        <Text style={styles.resultSubtitle}>{item.artists.map(a => a.name).join(', ')}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}

            {/* Podcasts */}
            {results.podcasts.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Podcasts</Text>
                <FlatList
                  data={results.podcasts}
                  horizontal
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleNavigation(item)}>
                      <View style={styles.resultContainer}>
                        <Image source={{ uri: item.images?.[0]?.url || 'default-image-url.jpg' }} style={styles.resultImage} />
                        <Text style={styles.resultName}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
          </ScrollView>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
    backgroundColor: '#333',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  resultContainer: {
    width: width * 0.3,
    marginRight: 15,
    alignItems: 'center',
  },
  resultImage: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default SearchScreen;
