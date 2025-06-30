const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPankyProducts, // Importar el nuevo controlador
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

router.route('/').get(getAllProducts).post(authMiddleware, createProduct);
router.route('/panky').get(authMiddleware, getPankyProducts); // Nueva ruta para Panky
router
  .route('/:id')
  .get(getProductById)
  .put(authMiddleware, updateProduct)
  .delete(authMiddleware, deleteProduct);

module.exports = router;
