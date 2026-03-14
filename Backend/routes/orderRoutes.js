const express = require('express');
const router = express.Router();
const { createOrder, getOrdersForCaterer, updateOrderStatus } = require('../controllers/orderController');
const { protect, protectCaterer } = require('../middleware/authMiddleware');

// Protected: Place an Order (logged-in users only)
router.post('/', protect, createOrder);

// Protected: Caterer Views Incoming Orders
router.get('/caterer', protectCaterer, getOrdersForCaterer);

// Protected: Caterer Updates Order Status
router.put('/:id/status', protectCaterer, updateOrderStatus);

module.exports = router;
