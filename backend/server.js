const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configuración de CORS para producción
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://tu-frontend-url.vercel.app', // Cambiar por tu URL de Vercel real
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://tu-dominio.com' // Si tienes un dominio personalizado
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Middleware de logging para debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

if (!process.env.MONGO_URI) {
  console.error('ERROR: La variable MONGO_URI no está definida en process.env. Verifica tu archivo .env y su formato.');
  process.exit(1);
} else {
  console.log('process.env.MONGO_URI encontrado:', process.env.MONGO_URI);
}

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error de conexión a MongoDB:', err));

app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static('uploads'));

// Usar Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    availableRoutes: [
      'GET /',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/products',
      'POST /api/products'
    ]
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});