import axios from 'axios';

// Configurar la base URL para todas las requests
// En desarrollo, usar proxy. En producción, usar la URL del API
const API_URL = process.env.NODE_ENV === 'development' 
  ? '' // Use proxy configured in package.json "proxy" field during development
  : process.env.REACT_APP_API_URL || 'http://localhost:3001';
  
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

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
