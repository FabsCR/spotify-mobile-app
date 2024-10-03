import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI_WEB, SPOTIFY_REDIRECT_URI_MOBILE, SPOTIFY_SCOPE, SPOTIFY_AUTH_ENDPOINT, SPOTIFY_RESPONSE_TYPE } from '@env';

// URI de redirección dinámica según el entorno
const REDIRECT_URI = Platform.OS === 'web'
  ? SPOTIFY_REDIRECT_URI_WEB // Web
  : SPOTIFY_REDIRECT_URI_MOBILE; // Mobile (Expo Go)

const LoginScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [authToken, setAuthToken] = useState(null);

  // Comprobar si hay un token guardado en el almacenamiento seguro o localStorage
  useEffect(() => {
    const checkToken = async () => {
      if (Platform.OS === 'web' && window.location.hash) {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace('#', ''));
        const token = params.get('access_token');
        if (token) {
          console.log("Token found in URL:", token);
          await storeToken(token);
          setAuthToken(token);
          navigation.navigate('Home');
        }
      } else {
        const storedToken = await retrieveToken();
        if (storedToken) {
          setAuthToken(storedToken);
          navigation.navigate('Home');
        } else {
          console.log("No token found, staying in LoginScreen.");
        }
      }
    };

    checkToken();
  }, []);

  const handleLogin = async () => {
    const authUrl = `${SPOTIFY_AUTH_ENDPOINT}?client_id=${SPOTIFY_CLIENT_ID}&response_type=${SPOTIFY_RESPONSE_TYPE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SPOTIFY_SCOPE)}`;

    if (Platform.OS === 'web') {
      window.location.href = authUrl;
    } else {
      try {
        Linking.openURL(authUrl);
        Linking.addEventListener('url', async (event) => {
          const { url } = event;
          const token = url.match(/access_token=([^&]*)/)[1];
          if (token) {
            await storeToken(token);
            setAuthToken(token);
            navigation.navigate('Home');
          }
        });
      } catch (error) {
        console.error('Error during login', error);
      }
    }
  };

  const storeToken = async (token) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('spotify_token', token);
        console.log("Token stored in localStorage:", token);
      } else {
        await SecureStore.setItemAsync('spotify_token', token);
        console.log("Token stored in SecureStore:", token);
      }
    } catch (error) {
      console.error('Failed to store token', error);
    }
  };

  const retrieveToken = async () => {
    try {
      let token;
      if (Platform.OS === 'web') {
        token = localStorage.getItem('spotify_token');
        console.log("Token retrieved from localStorage:", token);
      } else {
        token = await SecureStore.getItemAsync('spotify_token');
        console.log("Token retrieved from SecureStore:", token);
      }
      return token;
    } catch (error) {
      console.error('Failed to retrieve token', error);
      return null;
    }
  };

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SpotyTEC</Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Authorize with Spotify</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.aboutButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.aboutText}>About Us</Text>
      </TouchableOpacity>

      {/* Modal para About Us */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>About Us</Text>
              <Text style={styles.modalText}>
                SpotyTEC es una app diseñada para ayudarte a buscar contenido en Spotify. Con SpotyTEC, puedes encontrar canciones, álbumes, artistas y podcasts usando la API de Spotify.
              </Text>
              <View style={styles.footer}>
                <Text style={styles.footerTitle}>Developers:</Text>
                <TouchableOpacity onPress={() => openLink('https://github.com/FabsCR')}>
                  <Text style={styles.footerLink}>Fabian Fernandez</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLink('https://github.com/rooseveltalej')}>
                  <Text style={styles.footerLink}>Roosevelt Perez</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLink('https://github.com/LuisMendezTEC')}>
                  <Text style={styles.footerLink}>Luis Mendez</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 50,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  aboutButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 50,
    width: '80%',
    alignItems: 'center',
  },
  aboutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 20,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  footerLink: {
    fontSize: 16,
    color: '#1DB954',
    marginBottom: 5,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 50,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;