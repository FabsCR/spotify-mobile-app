import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';
import { getNewReleases, searchAlbums, searchArtists, searchPodcasts, searchSongs } from '../services/spotifyAPI.js';

const { width } = Dimensions.get('window');

const translations = {
  en: {
    searchPlaceholder: 'Search for artists, albums, songs or podcasts',
    loading: 'Loading...',
    artists: 'Artists',
    albums: 'Albums',
    songs: 'Songs',
    podcasts: 'Podcasts',
    top50: 'Discover trending songs',
  },
  es: {
    searchPlaceholder: 'Buscar artistas, álbumes, canciones o podcasts',
    loading: 'Cargando...',
    artists: 'Artistas',
    albums: 'Álbumes',
    songs: 'Canciones',
    podcasts: 'Podcasts',
    top50: 'Descubre las canciones en tendencia',
  },
};

const SearchScreen = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    artists: [],
    albums: [],
    songs: [],
    podcasts: [],
  });
  const [loading, setLoading] = useState(false);
  const [newReleases, setNewReleases] = useState([]);
  const [offsetReleases, setOffsetReleases] = useState(0);
  const t = translations[language];

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const [artistResults, albumResults, songResults, podcastResults] = await Promise.all([
        searchArtists(query),
        searchAlbums(query),
        searchSongs(query),
        searchPodcasts(query),
      ]);
      setResults({
        artists: artistResults,
        albums: albumResults,
        songs: songResults,
        podcasts: podcastResults,
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (item) => {
    navigation.navigate('Details', { item });
  };

  const loadInitialData = async () => {
    setLoading(true);
    const releases = await getNewReleases(0);
    setNewReleases(releases);
    setLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const renderSection = (title, data) => (
    data.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleNavigation(item)}>
              <View style={styles.resultContainer}>
                <Image source={{ uri: item.images?.[0]?.url || item.album?.images?.[0]?.url || 'default-image-url.jpg' }} style={styles.resultImage} />
                <Text style={styles.resultName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    )
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={t.searchPlaceholder}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
      {loading ? (
        <Text style={styles.loadingText}>{t.loading}</Text>
      ) : (
        <FlatList
          data={[{ key: 'searchResults' }]}
          renderItem={() => (
            <>
              {query !== '' && (
                <>
                  {renderSection(t.artists, results.artists)}
                  {renderSection(t.albums, results.albums)}
                  {renderSection(t.songs, results.songs)}
                  {renderSection(t.podcasts, results.podcasts)}
                </>
              )}
              {query === '' && newReleases.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{t.top50}</Text>
                  <FlatList
                    data={newReleases}
                    keyExtractor={(item) => item.track.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleNavigation(item.track)}>
                        <View style={styles.centeredResultContainer}>
                          <Image source={{ uri: item.track.album.images?.[0]?.url || 'default-image-url.jpg' }} style={styles.centeredResultImage} />
                          <Text style={styles.resultName}>{item.track.name}</Text>
                          <Text style={styles.resultSubtitle}>{item.track.artists.map((a) => a.name).join(', ')}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )}
            </>
          )}
        />
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
  centeredResultContainer: {
    width: width * 0.9,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 10,
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
  centeredResultImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default SearchScreen;