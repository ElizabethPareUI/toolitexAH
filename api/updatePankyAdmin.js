const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const newPassword = 'PankyPassword123!';

const updatePassword = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('ERROR: La variable MONGO_URI no está definida en process.env. Verifica tu archivo .env y su formato.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ email: 'adminpanky@test.com' });

    if (user) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      console.log('Contraseña del administrador de Panky actualizada exitosamente.');
    } else {
      console.log('Usuario adminpanky@test.com no encontrado.');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    process.exit(1);
  }
};

updatePassword();
