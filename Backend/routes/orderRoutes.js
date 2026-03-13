const express = require('express');
const router = express.Router();
const { createOrder, getOrdersForCaterer, updateOrderStatus } = require('../controllers/orderController');
const { protectCaterer } = require('../middleware/authMiddleware');

// Public: Place an Order
router.post('/', createOrder);

// Protected: Caterer Views Incoming Orders
router.get('/caterer', protectCaterer, getOrdersForCaterer);

// Protected: Caterer Updates Order Status
router.put('/:id/status', protectCaterer, updateOrderStatus);

module.exports = router;
