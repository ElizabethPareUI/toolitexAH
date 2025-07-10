import axios from 'axios';

// Configurar la base URL para todas las requests
// En desarrollo, no usar baseURL porque el proxy maneja /api
// En producción, usar la URL completa del API
const isProduction = process.env.NODE_ENV === 'production';
const API_URL = isProduction ? process.env.REACT_APP_API_URL : '';
  
if (API_URL) {
  axios.defaults.baseURL = API_URL;
}
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptor para requests - añadir token automáticamente
axios.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.token) {
        config.headers['x-auth-token'] = user.token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejar errores de autenticación
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
