const Product = require('../models/Product');

// @desc    Crear un nuevo producto
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, stock, images } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      sizes,
      stock,
      images,
      user: req.user.id, // Asignado desde el middleware de autenticación
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

// @desc    Obtener todos los productos con paginación y filtros
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    // Filtros
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category && req.query.category !== 'all'
      ? { category: req.query.category }
      : {};

    const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
    const maxPrice = req.query.maxPrice ? { price: { $lte: Number(req.query.maxPrice) } } : {};
    
    // Combinar filtros de precio
    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
    const price = Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

    // Combinar todos los filtros
    const filters = { ...keyword, ...category, ...price };

    const count = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Obtener categorías únicas para el filtro
    const categories = await Product.distinct('category');

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      categories,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  const { name, description, price, category, sizes, stock, images } = req.body;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar que el usuario que actualiza es el que creó el producto
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description, price, category, sizes, stock, images } },
      { new: true }
    );

    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar que el usuario que elimina es el que creó el producto
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    await product.deleteOne(); // Usar deleteOne() en la instancia

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};

// @desc    Obtener productos de Panky con filtros y paginación
// @route   GET /api/products/panky
// @access  Private
exports.getPankyProducts = async (req, res) => {
  try {
    console.log('=== getPankyProducts llamado ===');
    console.log('Headers recibidos:', req.headers);
    console.log('User from auth middleware:', req.user);
    console.log('Query params:', req.query);
    
    const pageSize = Number(req.query.limit) || 6;
    const page = Number(req.query.page) || 1;

    // Filtro base: solo productos de la marca 'Panky'
    const baseFilter = { brand: 'Panky' };

    // Filtros de búsqueda
    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category && req.query.category !== 'all'
      ? { category: req.query.category }
      : {};

    // Filtros de precio
    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
    const price = Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

    // Filtro de stock
    const inStock = req.query.inStock === 'true' ? { countInStock: { $gt: 0 } } : {};

    // Combinar todos los filtros
    const filters = { ...baseFilter, ...keyword, ...category, ...price, ...inStock };

    const count = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Obtener datos para los filtros del frontend
    const allPankyProducts = await Product.find(baseFilter);
    const categories = [...new Set(allPankyProducts.map(p => p.category))];
    const prices = allPankyProducts.map(p => p.price);
    const minPriceAvailable = Math.min(...prices);
    const maxPriceAvailable = Math.max(...prices);

    res.json({
      products,
      pagination: {
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
      },
      filters: {
        appliedFilters: req.query,
        categories,
        priceRange: {
          min: minPriceAvailable,
          max: maxPriceAvailable,
        },
      },
    });
    
    console.log('=== Respuesta enviada exitosamente ===');
  } catch (error) {
    console.error(`Error fetching Panky products: ${error.message}`);
    console.error('Stack trace:', error.stack);
    res.status(500).send('Error del Servidor');
  }
};
