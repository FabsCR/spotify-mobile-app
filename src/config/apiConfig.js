export const SPOTIFY_CLIENT_ID = 'YOUR_CLIENT_ID';
export const SPOTIFY_REDIRECT_URI = 'yourapp://redirect';  // aqui va la uri pero aun no se como se obtiene eso
export const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
export const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
export const SPOTIFY_SCOPES = 'user-read-private user-read-email';


/*
Maes este archivo es un archivo de configuración. 
Contiene las constantes necesarias para las llamadas a la API, como 
los ID de cliente (Client ID), URI de redirección y las URL de 
los endpoints de autenticación de Spotify. 
Estas configuraciones son fijas y se usan en spotifyAPI.js para 
construir las solicitudes adecuadamente.
*/