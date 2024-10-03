import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env';
import axios from 'axios';
import { Buffer } from 'buffer';

// Client Credentials para obtener token de acceso
export const getClientCredentialsToken = async () => {
  const clientId = SPOTIFY_CLIENT_ID;
  const clientSecret = SPOTIFY_CLIENT_SECRET;
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

export const getAlbumTracks = async (albumId) => {
  try {
    const token = await getClientCredentialsToken();
    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching album tracks:', error);
    return [];
  }
};

// Guardar una canción en la biblioteca del usuario
export const saveTrack = async (trackId, token) => {
  try {
    const response = await axios.put(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving song:', error);
    throw error;
  }
};

// Eliminar una canción de la biblioteca del usuario
export const removeTrack = async (trackId, token) => {
  try {
    const response = await axios.delete(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing song:', error);
    throw error;
  }
};

// Seguir a un artista
export const followArtist = async (artistId, token) => {
  try {
    const response = await axios.put(`https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error following artist:', error);
    throw error;
  }
};

// Dejar de seguir a un artista
export const unfollowArtist = async (artistId, token) => {
  try {
    const response = await axios.delete(`https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error unfollowing artist:', error);
    throw error;
  }
};