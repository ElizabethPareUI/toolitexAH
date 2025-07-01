const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // Importamos las funciones

// @route   POST api/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public
router.post('/register', register); // La lógica ahora está en el controlador

// @route   POST api/auth/login
// @desc    Iniciar sesión y obtener token
// @access  Public
router.post('/login', login); // La lógica ahora está en el controlador

module.exports = router;
