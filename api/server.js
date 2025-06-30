const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Depuración de dotenv ---
const result = dotenv.config();

if (result.error) {
  console.error('Error al parsear el archivo .env:', result.error);
  process.exit(1);
}

console.log('Variables parseadas desde .env:', result.parsed);
// --- Fin de la depuración ---

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

// Usar Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

app.get('/api/config/paypal', (req, res) => 
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});