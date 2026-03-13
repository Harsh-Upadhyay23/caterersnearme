const Order = require('../models/Order');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
  try {
    const {
      customerName, customerPhone, customerEmail,
      eventDate, eventLocation, guestCount, specialInstructions,
      catererId, catererName, menuId, menuName, pricePerPerson,
    } = req.body;

    const totalPrice = pricePerPerson * guestCount;

    const order = await Order.create({
      customerName, customerPhone, customerEmail,
      eventDate, eventLocation, guestCount, specialInstructions,
      catererId, catererName, menuId, menuName, pricePerPerson,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! The caterer will contact you soon.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for a caterer
// @route   GET /api/orders/caterer
// @access  Private (Caterer)
const getOrdersForCaterer = async (req, res, next) => {
  try {
    const orders = await Order.find({ catererId: req.caterer.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Caterer)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, catererId: req.caterer.id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrdersForCaterer, updateOrderStatus };
