const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Lógica para registrar un usuario
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Validar que los datos lleguen
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Por favor, ingresa todos los campos' });
    }

    // 2. Validaciones específicas
    // Validar nombre
    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'El nombre debe tener al menos 2 caracteres' });
    }
    if (name.trim().length > 50) {
      return res.status(400).json({ message: 'El nombre no puede exceder 50 caracteres' });
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim())) {
      return res.status(400).json({ message: 'El nombre solo puede contener letras y espacios' });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Ingrese un email válido' });
    }
    if (email.length > 100) {
      return res.status(400).json({ message: 'El email no puede exceder 100 caracteres' });
    }

    // Validar contraseña
    if (password.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (password.length > 128) {
      return res.status(400).json({ message: 'La contraseña no puede exceder 128 caracteres' });
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos una letra minúscula' });
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos una letra mayúscula' });
    }
    if (!/(?=.*\d)/.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos un número' });
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos un carácter especial (@$!%*?&)' });
    }

    // 3. Verificar si el usuario ya existe
    let user = await User.findOne({ email: email.trim().toLowerCase() });
    if (user) {
      return res.status(400).json({ message: 'Ya existe un usuario con este email' });
    }

    // 4. Crear una nueva instancia de usuario
    user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    // Guardar el usuario en la BD (el hook de Mongoose encripta la contraseña)
    await user.save();

    // 5. Crear y firmar el JSON Web Token
    const payload = {
      user: {
        id: user.id, // El id que genera MongoDB
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // Expira en 1 hora
      (err, token) => {
        if (err) throw err;
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token,
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Lógica para iniciar sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validar que los datos lleguen
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, ingresa todos los campos' });
    }

    // 2. Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // 3. Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // 4. Crear y firmar el JSON Web Token (igual que en el registro)
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token,
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
};
