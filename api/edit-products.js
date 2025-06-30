const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

async function editProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');
    
    // 1. Ver todos los productos
    console.log('\n=== PRODUCTOS ACTUALES ===');
    const products = await Product.find({});
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (ID: ${product._id})`);
    });
    
    // 2. Ejemplo: Cambiar el precio del primer producto
    // Descomenta las siguientes líneas para hacer cambios:
    
    /*
    console.log('\n=== EDITANDO PRODUCTO ===');
    const firstProduct = await Product.findById(products[0]._id);
    firstProduct.price = 29.99; // Nuevo precio
    firstProduct.name = "Camiseta Premium"; // Nuevo nombre
    await firstProduct.save();
    console.log(`Producto actualizado: ${firstProduct.name} - $${firstProduct.price}`);
    */
    
    // 3. Ejemplo: Agregar un nuevo producto
    // Descomenta las siguientes líneas para agregar un producto:
    
    /*
    console.log('\n=== AGREGANDO NUEVO PRODUCTO ===');
    const newProduct = new Product({
      user: products[0].user, // Usar el mismo usuario que los otros productos
      name: "Producto Nuevo",
      image: "/images/nuevo-producto.jpg",
      brand: "Mi Marca",
      category: "Nueva Categoría",
      description: "Descripción del nuevo producto",
      rating: 4.0,
      numReviews: 0,
      price: 39.99,
      countInStock: 20,
      reviews: []
    });
    
    await newProduct.save();
    console.log(`Nuevo producto creado: ${newProduct.name}`);
    */
    
    // 4. Ejemplo: Eliminar un producto por ID
    // await Product.findByIdAndDelete('ID_DEL_PRODUCTO_AQUI');
    
    await mongoose.disconnect();
    console.log('\nConexión cerrada');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

editProducts();
