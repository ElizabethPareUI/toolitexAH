const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS más permisiva para Railway
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman) y desde cualquier origen en desarrollo
    if (!origin || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:3000',
      'https://localhost:3000',
      process.env.FRONTEND_URL,
      'https://toolitexah.vercel.app', // Ejemplo de URL de Vercel
      /\.vercel\.app$/, // Permitir cualquier subdominio de vercel.app
      /\.railway\.app$/ // Permitir subdominios de railway.app
    ].filter(Boolean);
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      return callback(null, true);
    }
    
    // En producción, ser más estricto pero log el error
    console.log('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Origin', 'X-Requested-With', 'Accept']
};

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Aplicar CORS
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Esquema de Usuario simplificado
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

// Conectar a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    status: 'OK',
    timestamp: new Date().toISOString(),
    routes: [
      'GET /',
      'POST /api/auth/register',
      'POST /api/auth/login'
    ]
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Ruta de registro
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('=== REGISTRO REQUEST ===');
    console.log('Body recibido:', req.body);
    
    const { name, email, password } = req.body;

    // Validación básica
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos',
        received: { name: !!name, email: !!email, password: !!password }
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    const savedUser = await user.save();
    console.log('Usuario creado:', savedUser._id);

    // Generar token
    const token = jwt.sign(
      { 
        userId: savedUser._id,
        isAdmin: savedUser.isAdmin 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    // Respuesta exitosa
    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      isAdmin: savedUser.isAdmin,
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Ruta de login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Body recibido:', req.body);
    
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { 
        userId: user._id,
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  console.log(`=== RUTA NO ENCONTRADA ===`);
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  
  res.status(404).json({ 
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login'
    ],
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Inicializar servidor
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📅 Timestamp: ${new Date().toISOString()}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📦 MongoDB URI: ${process.env.MONGO_URI ? 'CONFIGURADO' : 'NO CONFIGURADO'}`);
      console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'CONFIGURADO' : 'NO CONFIGURADO'}`);
    });
  } catch (error) {
    console.error('Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
