import axios from 'axios';
import { Buffer } from 'buffer'; // Para manejar codificación Base64 en React Native

// Obtener token de acceso de Spotify
export const getSpotifyToken = async () => {
  const clientId = 'YOUR_CLIENT_ID';
  const clientSecret = 'YOUR_CLIENT_SECRET';
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
    return response.data.artists.items;
  } catch (error) {
    console.error('Error searching for artists:', error);
    return [];
  }
};
