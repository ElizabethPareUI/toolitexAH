const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});