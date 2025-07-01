const Product = require('../models/Product');
const User = require('../models/User');

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
  } catch (error) {
    console.error(`Error fetching Panky products: ${error.message}`);
    res.status(500).send('Error del Servidor');
  }
};

// @desc    Crear un nuevo producto (solo admin de Panky)
// @route   POST /api/products/panky
// @access  Private/Admin
exports.createPankyProduct = async (req, res) => {
  try {
    console.log('=== createPankyProduct llamado ===');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    console.log('req.user:', req.user);

    // Verificar que sea admin de Panky
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || !adminUser.isAdmin || adminUser.email !== 'adminpanky@test.com') {
      return res.status(403).json({ message: 'No autorizado para crear productos de Panky' });
    }

    const {
      name,
      description,
      price,
      category,
      countInStock,
    } = req.body;

    // Validaciones
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (price < 1000) {
      return res.status(400).json({ message: 'El precio mínimo es $1,000' });
    }

    // Configurar imagen
    let image = '/images/placeholder.png'; // Imagen por defecto
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    // Crear el producto
    const product = new Product({
      name,
      image,
      brand: 'Panky', // Siempre será Panky para este admin
      category,
      description,
      rating: 0,
      numReviews: 0,
      price: Number(price),
      countInStock: Number(countInStock) || 0,
      user: req.user.id,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating Panky product:', error.message);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Obtener productos de Mia con filtros y paginación
// @route   GET /api/products/mia
// @access  Public (para distribuidores con código)
exports.getMiaProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 6;
    const page = Number(req.query.page) || 1;

    // Filtro base: solo productos de la marca 'Mia'
    const baseFilter = { brand: 'Mia' };

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
    const allMiaProducts = await Product.find(baseFilter);
    const categories = [...new Set(allMiaProducts.map(p => p.category))];
    const prices = allMiaProducts.map(p => p.price);
    const minPriceAvailable = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPriceAvailable = prices.length > 0 ? Math.max(...prices) : 1000;

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
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
};
