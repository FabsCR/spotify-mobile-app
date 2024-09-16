import React from 'react';
import { StyleSheet } from 'react-native';
import SearchAlbum from './src/components/SearchAlbum';
import SearchArtists from './src/components/SearchArtists';
import SearchPodcast from './src/components/SearchPodcast';


export default function App() {
  return (
    <>
    <SearchArtists />
    <SearchAlbum />
    <SearchPodcast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  titleInformation: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  
  },
});
