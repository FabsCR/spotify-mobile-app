import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = () => {
    // maes aqui va la logica para redireccion OAUTH en un futuro
    // por ahora se navega directamente al homescreen que hizo luisito fuap
    navigation.navigate('Home');
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
      
      {/* Modal for About Us */}
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
                SpotyTEC is an app designed to help you search for content on Spotify. With SpotyTEC, you can find songs, albums, artists, and podcasts using the Spotify API.
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
              <Text style={styles.closeButtonText}>Close</Text>
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