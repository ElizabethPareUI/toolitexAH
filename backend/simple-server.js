const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());

// Simple User model
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://mariapare:TOOLITEX25@cluster0.q8wcdkq.mongodb.net/Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando', status: 'OK' });
});

// Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Register request received:', { name, email, password: '***' });
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      'eliyestefi',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login request received:', { email, password: '***' });
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      'eliyestefi',
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Catch all other routes
app.use('*', (req, res) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'POST /api/auth/register',
      'POST /api/auth/login'
    ]
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
