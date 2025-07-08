const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Crear una nueva orden
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
  const { orderItems } = req.body; // Solo items, sin datos de pago o envío

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No hay artículos en la orden');
  }

  try {
    const order = new Order({ orderItems, user: req.user.id });

    const createdOrder = await order.save();

    // Actualizar el stock de los productos
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.qty;
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Obtener una orden por ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Orden no encontrada');
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Actualizar orden a pagada
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Orden no encontrada');
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Obtener las órdenes del usuario logueado
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};
