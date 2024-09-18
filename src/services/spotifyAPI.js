import axios from 'axios';
import { Buffer } from 'buffer'; // Para manejar codificación Base64 en React Native

// Obtener token de acceso de Spotify
export const getSpotifyToken = async () => {
  const clientId = 'API KEY';
  const clientSecret = 'API SECRET';
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64'); // Codificar en Base64

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

// Obtener información de un artista
export const getArtistInfo = async (artistId) => {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting artist info:', error);
    throw error;
  }
};

// Obtener información de un artista
export const getAlbumInfo = async (albumId) => {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting artist info:', error);
    throw error;
  }
};

// Obtener información de un artista
// Función para obtener la información de un podcast
export const getPodcastInfo = async (podcastId) => {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/shows/${podcastId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting podcast info:', error);
    throw error;
  }
};

// Buscar artistas
export const searchArtists = async (query) => {
  if (!query) return [];

  try {
    const token = await getSpotifyToken();
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
    console.log(response.data);
    console.log(response.data.artists.items);
    console.log(query);
    return response.data.artists.items;
  } catch (error) {
    console.error('Error searching for artists:', error);
    return [];
  }
};

export const searchAlbums = async (query) => {
  try {
    // Obtener el token de acceso
    const token = await getSpotifyToken();
    
    // Realizar la solicitud de búsqueda de álbumes
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type: 'album',
        limit: 10 // Puedes ajustar el límite según tus necesidades
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Retornar los resultados
    console.log(response.data.albums.items)
    return response.data.albums.items;
  } catch (error) {
    console.error('Error searching for albums:', error);
    throw error;
  }
};


export const searchPodcasts = async (query) => {
  try {
    // Obtener el token de acceso
    const accessToken = await getSpotifyToken();

    console.log('Access Token:', accessToken); // Asegúrate de que el token esté presente

    // Realizar la solicitud a la API de Spotify para buscar podcasts
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type: 'show', // 'show' se usa para buscar podcasts
        limit: 10, // Puedes ajustar el límite según tus necesidades
        market: 'US', // Puedes ajustar el mercado según tus necesidades
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('API Response:', response.data.shows.items[0]); // Verifica la estructura del response
    console.log(typeof(response.data.shows.items));

    // Devolver los resultados de la búsqueda
    return response.data.shows.items;
  } catch (error) {
    console.error('Error searching for podcasts:', error);
    // Asegúrate de capturar errores específicos
    if (error.response) {
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
    } else if (error.request) {
      console.error('Error Request Data:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    throw error;
  }
};