// src/config.js

const envApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Función para determinar la URL real
const getBaseUrl = () => {
  // Si la app detecta que está corriendo en la IP del emulador (Android)
  if (window.location.hostname === '10.0.2.2') {
    return 'http://10.0.2.2:5000';
  }

  // Si estamos en producción o en PC normal, usamos la variable de entorno
  return envApiUrl;
};

// Exportamos la constante para usarla en toda la app
export const API_URL = getBaseUrl();