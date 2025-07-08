// Configuración de producción para diferentes entornos
const config = {
  development: {
    apiUrl: 'http://localhost:3001',
    frontendUrl: 'http://localhost:3000'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://tu-backend.railway.app',
    frontendUrl: process.env.REACT_APP_FRONTEND_URL || 'https://tu-proyecto.vercel.app'
  }
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];
