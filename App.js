import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native'; // Asegúrate de importar StyleSheet correctamente
import HomeScreen from './src/components/HomeScreen'; // Pantalla inicial
import SearchAlbum from './src/components/SearchAlbum';
import SearchArtists from './src/components/SearchArtists';
import SearchPodcast from './src/components/SearchPodcast';
import SearchSong from './src/components/SearchSong';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Artists" component={SearchArtists} />
        <Stack.Screen name="Albums" component={SearchAlbum} />
        <Stack.Screen name="Podcasts" component={SearchPodcast} />
        <Stack.Screen name="Songs" component={SearchSong} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 50,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
