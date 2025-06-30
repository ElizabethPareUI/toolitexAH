const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

router.route('/').get(getAllProducts).post(authMiddleware, createProduct);
router
  .route('/:id')
  .get(getProductById)
  .put(authMiddleware, updateProduct)
  .delete(authMiddleware, deleteProduct);

module.exports = router;
