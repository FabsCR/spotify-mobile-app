import axios from 'axios';
import { Buffer } from 'buffer';

// Client Credentials para obtener token de acceso
export const getClientCredentialsToken = async () => {
  const clientId = 'df53639f2dd245f4a1c3b4c3e0b8dfda';
  const clientSecret = '08638641c5894cee803b102e5a35c657';
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token',
      'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error);
    throw error;
  }
};

// Función de búsqueda general reutilizando el token de Client Credentials
export const searchArtists = async (query) => {
  if (!query) return [];
  
  try {
    const token = await getClientCredentialsToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'artist',
        limit: 10,
      },
    });

    return response.data.artists.items;
  } catch (error) {
    console.error('Error searching for artists:', error);
    return [];
  }
};

export const searchAlbums = async (query) => {
  try {
    const token = await getClientCredentialsToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type: 'album',
        limit: 10,
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data.albums.items;
  } catch (error) {
    console.error('Error searching for albums:', error);
    throw error;
  }
};

export const searchPodcasts = async (query) => {
  try {
    const token = await getClientCredentialsToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type: 'show',
        limit: 10,
        market: 'US',
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data.shows.items;
  } catch (error) {
    console.error('Error searching for podcasts:', error);
    throw error;
  }
};

export const searchSongs = async (query) => {
  try {
    const token = await getClientCredentialsToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type: 'track',
        limit: 10,
        market: 'US',
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data.tracks.items;
  } catch (error) {
    console.error('Error searching for songs:', error);
    throw error;
  }
};


/*
Maes este archivo contiene toda la lógica de interacción con la API de Spotify. 
Es el archivo donde se implementa las funciones que realizan llamadas HTTP a la 
API de Spotify, como obtener tokens de acceso, buscar artistas, canciones, 
álbumes, acceder al perfil del usuario, etc. 
Este archivo se encarga de gestionar la comunicación con la API de Spotify, 
manejar los tokens de acceso y devolver los resultados de las solicitudes.
*/