import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button } from 'react-native-web';
import ArtistInfo from './src/components/ArtistInfo';

export default function App() {
  return (
    <>
    <Text style={styles.titleInformation}>Información de artistas</Text>
    <ScrollView>

    <View>
    <ArtistInfo artistId="0OdUWJ0sBjDrqHygGUXeCF" />
    <ArtistInfo artistId="6qqNVTkY8uBg9cP3Jd7DAH" />
    <ArtistInfo artistId="3TVXtAsR1Inumwj472S9r4" />
    </View>
    </ScrollView>
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
