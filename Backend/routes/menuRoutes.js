const express = require('express');
const router = express.Router();

const {
  getMenusByCaterer,
  createMenu,
  updateMenu,
  deleteMenu,
} = require('../controllers/menuController');

const { protectCaterer } = require('../middleware/authMiddleware');

// Get all menus for a specific caterer (Public)
router.get('/caterer/:catererId', getMenusByCaterer);

// Protected routes (Only logged-in caterer can manage their menus)
router.use(protectCaterer);

router.post('/', createMenu);
router.route('/:id').put(updateMenu).delete(deleteMenu);

module.exports = router;
