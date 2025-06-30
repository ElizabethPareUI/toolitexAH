const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPankyProducts,
  createPankyProduct, // Importar el nuevo controlador
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/').get(getAllProducts).post(authMiddleware, createProduct);
router.route('/panky').get(authMiddleware, getPankyProducts).post(authMiddleware, upload.single('image'), createPankyProduct); // Ruta para crear producto Panky
router
  .route('/:id')
  .get(getProductById)
  .put(authMiddleware, updateProduct)
  .delete(authMiddleware, deleteProduct);

module.exports = router;
