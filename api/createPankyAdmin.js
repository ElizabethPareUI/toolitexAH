const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createPankyAdmin = async () => {
  try {
    // Conectar a la base de datos MongoDB
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Verificar si el usuario admin ya existe
    const existingAdmin = await User.findOne({ email: 'adminpanky@test.com' });

    if (existingAdmin) {
      process.exit(0);
    }

    // Crear el usuario admin de Panky
    const hashedPassword = await bcrypt.hash('123456', 10);

    const adminUser = new User({
      name: 'Admin Panky',
      email: 'adminpanky@test.com',
      password: hashedPassword,
      isAdmin: true,
      provider: 'Panky Hilados', // Identificador del proveedor
      providerCode: 'panky' // Código para identificar productos
    });

    const savedUser = await adminUser.save();

    process.exit(0);
  } catch (error) {
    console.error('Error al crear el usuario admin:', error);
    process.exit(1);
  }
};

createPankyAdmin();
