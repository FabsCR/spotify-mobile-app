import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getNewReleases, searchAlbums, searchArtists, searchPodcasts, searchSongs } from '../services/spotifyAPI.js';

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
  const [newReleases, setNewReleases] = useState([]);
  const [offsetReleases, setOffsetReleases] = useState(0);

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

  const loadInitialData = async () => {
    setLoading(true);
    const releases = await getNewReleases(0);

    setNewReleases(releases);
    setLoading(false);
  };


  useEffect(() => {
    loadInitialData();

    const fetchNewContent = async () => {
      setLoading(true);
      try {
        const [ releases ] = await Promise.all([
          getNewReleases(),
        ]);
        setNewReleases(releases);
      } catch (error) {
        console.error('Error fetching new content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewContent();
  }, []);

    // Función para cargar más datos
    const loadMoreData = async (type) => {
      setLoading(true);
      let releases;
  
    if (type === 'releases') {
        releases = await getNewReleases(offsetReleases);
        setNewReleases((prev) => [...prev, ...releases]);
        setOffsetReleases((prev) => prev + 10);
      } 
      setLoading(false);
    };

    const handleScroll = (event, type) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const isEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20; // Margen de 20px
  
      if (isEnd && !loading) {
        loadMoreData(type);
      }
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
          <ScrollView showsVerticalScrollIndicator={false}>
            {query !== '' && (
              <>
                {results.artists.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Artists</Text>
                    <FlatList
                      data={results.artists}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleNavigation(item)}>
                          <View style={styles.resultContainer}>
                            <Image source={{ uri: item.images?.[0]?.url || 'default-image-url.jpg' }} style={styles.resultImage} />
                            <Text style={styles.resultName}>{item.name}</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      horizontal // Enable horizontal scrolling
                      showsHorizontalScrollIndicator={false} // Hide horizontal scroll bar
                    />
                  </View>
                )}
  
                {results.albums.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Albums</Text>
                    <FlatList
                      data={results.albums}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleNavigation(item)}>
                          <View style={styles.resultContainer}>
                            <Image source={{ uri: item.images?.[0]?.url || 'default-image-url.jpg' }} style={styles.resultImage} />
                            <Text style={styles.resultName}>{item.name}</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                )}
  
                {results.songs.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Songs</Text>
                    <FlatList
                      data={results.songs}
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
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                )}
  
                {results.podcasts.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Podcasts</Text>
                    <FlatList
                      data={results.podcasts}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleNavigation(item)}>
                          <View style={styles.resultContainer}>
                            <Image source={{ uri: item.images?.[0]?.url || 'default-image-url.jpg' }} style={styles.resultImage} />
                            <Text style={styles.resultName}>{item.name}</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                )}
              </>
            )}

        {/* Repetimos lo mismo para los otros resultados nuevos */}
        {/* Sección de nuevos lanzamientos - New Releases */}
        {newReleases.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top 50 Global</Text>
          <FlatList
            data={newReleases}
            keyExtractor={(item) => item.track.id} // Los items de la playlist tienen una estructura diferente, el ID está en 'track'
            renderItem={({ item }) => (
              <View style={styles.centeredResultContainer}>
                <TouchableOpacity onPress={() => handleNavigation(item.track)}>
                  <Image 
                    source={{ uri: item.track.album.images?.[0]?.url || 'default-image-url.jpg' }} 
                    style={styles.centeredResultImage} 
                  />
                  <Text style={styles.resultName}>{item.track.name}</Text>
                  <Text style={styles.resultSubtitle}>{item.track.artists.map(a => a.name).join(', ')}</Text>
                </TouchableOpacity>
              </View>
            )}
            numColumns={1} // Aseguramos que solo se muestre 1 elemento por fila
            onScroll={(event) => handleScroll(event, 'top50')}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

          </ScrollView>
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
      width: width * 0.9, // Aumenta el ancho para centrar mejor
      marginRight: 20,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center', // Centramos el contenedor en la pantalla
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
      width: width * 0.6, // Aumentamos el tamaño de la imagen
      height: width * 0.6, // Para que la imagen esté más centrada
      borderRadius: 10,
      marginBottom: 10,
    },
  });
  
  export default SearchScreen;