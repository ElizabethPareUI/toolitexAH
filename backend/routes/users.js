const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController');
const { auth, admin } = require('../middlewares/authMiddleware');

// Ruta para registrar un usuario y obtener todos los usuarios (admin)
router.route('/').post(registerUser).get(auth, admin, getUsers);

// Ruta para el login de usuario
router.post('/login', authUser);

// Rutas para el perfil del usuario logueado (obtener y actualizar)
router
  .route('/profile')
  .get(auth, getUserProfile)
  .put(auth, updateUserProfile);
  
// Rutas para un usuario específico por ID (borrar, obtener, actualizar por admin)
router
  .route('/:id')
  .delete(auth, admin, deleteUser)
  .get(auth, admin, getUserById)
  .put(auth, admin, updateUser);

module.exports = router;
