const Product = require('./models/Product');
require('dotenv').config();

const updatePankyPrices = async () => {
  try {
    // Conectar a la base de datos MongoDB
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Conectado a MongoDB');

    // Obtener todos los productos de Panky
    const pankyProducts = await Product.find({ brand: 'Panky' });
    console.log(`Encontrados ${pankyProducts.length} productos de Panky para actualizar precios`);

    // Factor de conversión aproximado (los precios actuales están en USD, los convertimos a ARS)
    // Rango objetivo: 10.000 - 100.000 ARS
    // Rango actual aproximado: $15 - $245 USD

    const updatedProducts = [];

    // Actualizar cada producto
    for (const product of pankyProducts) {
      const currentPrice = product.price; // USD
      const newPrice = Math.floor(currentPrice * factor);

      await PankyProduct.findByIdAndUpdate(product._id, { price: newPrice });

      updatedProducts.push({
        name: product.name,
        oldPrice: currentPrice,
        newPrice: newPrice,
        category: product.category
      });
    }

    console.log(`Se actualizaron ${updatedProducts.length} productos de Panky con nuevo rango de precios ARS.`);
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error actualizando precios:', error);
    process.exit(1);
  }
};

updatePankyPrices();
