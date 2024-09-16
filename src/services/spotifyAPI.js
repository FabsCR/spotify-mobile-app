import axios from 'axios';

export const getSpotifyToken = async () => {
  const clientId = 'YOUR_CLIENT_ID';
  const clientSecret = 'YOUR_CLIENT_SECRET';
  const credentials = btoa(`${clientId}:${clientSecret}`);
  
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
    console.error('Error al obtener el token de acceso:', error);
  }
};


export  const getArtistInfo = async (artistId) => {
    const token = await getSpotifyToken();
  
    try {
      const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error al obtener la información del artista:', error);
    }
  };