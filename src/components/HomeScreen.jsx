// src/components/HomeScreen.js
import React, { useContext } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';


export default function HomeScreen({ navigation }) {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [isModalVisible, setModalVisible] = React.useState(false);

  const handleToggleLanguage = () => {
    toggleLanguage();
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../images/spotify-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>
        {language === 'en' ? 'Welcome to SpotyTEC' : 'Bienvenido a SpotyTEC'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Search')}>
        <Text style={styles.buttonText}>
          {language === 'en' ? 'Search' : 'Buscar'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#535353' }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {language === 'en' ? 'Settings' : 'Configuraciones'}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {language === 'en' ? 'Select Language' : 'Seleccionar Idioma'}
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleToggleLanguage}>
              <Text style={styles.buttonText}>
                {language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>
                {language === 'en' ? 'Cancel' : 'Cancelar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 50,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
});
