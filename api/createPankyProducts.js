const Product = require('./models/Product');
require('dotenv').config();

const createPankyProducts = async () => {
  try {
    // Conectar a la base de datos MongoDB
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Conectado a MongoDB');

    // Eliminar productos existentes de Panky para evitar duplicados
    await Product.deleteMany({ brand: 'Panky' });

    // Productos específicos de Panky Hilados
    const pankyProducts = [
      {
        name: 'Hilo Acrílico Panky Premium',
        category: 'Acrílicos',
        countInStock: 150,
        price: 25.50,
        description: 'Hilo acrílico de alta calidad, ideal para tejidos duraderos',
        image: '/images/hilo-acrilico.jpg',
        brand: 'Panky',
        user: '507f1f77bcf86cd799439011' // ID placeholder del admin
      },
      {
        name: 'Lana Merino Panky Soft',
        category: 'Lanas Premium',
        countInStock: 85,
        price: 62.30,
        description: 'Lana merino extra suave, perfecta para prendas delicadas',
        image: '/images/lana-merino.jpg',
        brand: 'Panky',
        user: '507f1f77bcf86cd799439011'
      },
      {
        name: 'Algodón Orgánico Panky',
        category: 'Fibras Naturales',
        countInStock: 120,
        price: 34.75,
        description: 'Algodón 100% orgánico, certificado y ecológico',
        image: '/images/algodon-organico.jpg',
        brand: 'Panky',
        user: '507f1f77bcf86cd799439011'
      },
      {
        name: 'Chenille Panky Soft',
        category: 'Texturas Premium',
        countInStock: 80,
        price: 41.25,
        description: 'Chenille ultra suave para mantas y cojines',
        image: '/images/chenille.jpg',
        brand: 'Panky',
        user: '507f1f77bcf86cd799439011'
      },
      {
        name: 'Lino Panky Natural',
        category: 'Fibras Ecológicas',
        countInStock: 95,
        price: 47.80,
        description: 'Lino 100% orgánico, perfecto para verano',
        image: '/images/lino-natural.jpg',
        brand: 'Panky',
        user: '507f1f77bcf86cd799439011'
      },
      {
        name: 'Kit Ganchillos Panky Pro',
        category: 'Herramientas Panky',
        countInStock: 30,
        price: 180.00,
        description: 'Set profesional de ganchillos ergonómicos',
        image: '/images/kit-ganchillos.jpg',
        brand: 'Panky',
        user: '507f1f77bcf86cd799439011'
      },
      {
        name: 'Hilo Acrílico Panky Colors',
        category: 'Acrílicos Premium',
        countInStock: 200,
        price: 22.90,
        description: 'Acrílico premium en 50 colores vibrantes',
        image: '/images/hilo-colores.jpg',
        brand: 'Panky',
        user: '507f1f77bcf86cd799439011'
      },
      {
        name: 'Lana Bouclé Panky Texture',
        category: 'Texturas Especiales',
        countInStock: 60,
        price: 72.50,
        description: 'Bouclé con textura única para proyectos modernos',
        image: '/images/lana-boucle.jpg',
        brand: 'Panky',
        user: '507f1f77bcf86cd799439011'
      }
    ];

    // Insertar productos
    const savedProducts = await Product.insertMany(pankyProducts);

    mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada');
  } catch (error) {
    console.error('Error al crear los productos de Panky:', error);
    process.exit(1);
  }
};

createPankyProducts();
