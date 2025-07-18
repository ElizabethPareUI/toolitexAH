const express = require('express');
const router = express.Router();
const { 
    addOrderItems, 
    getOrderById, 
    updateOrderToPaid, 
    getMyOrders 
} = require('../controllers/orderController');
const protect = require('../middlewares/authMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

module.exports = router;
