const express = require('express');
const router = express.Router();

const {
  getAllCaterers,
  getCatererById,
  getCatererBySlug,
  createCaterer,
  updateCatererProfile,
  searchCaterers
} = require('../controllers/catererController');

const { catererValidationRules, validate } = require('../middleware/validate');
const { protectCaterer } = require('../middleware/authMiddleware');

const {
  registerCaterer,
  loginCaterer,
  getMeCaterer,
  logoutCaterer,
} = require('../controllers/catererAuthController');

// Auth Routes
router.post('/register', registerCaterer);
router.post('/login', loginCaterer);
router.get('/me', protectCaterer, getMeCaterer);
router.post('/logout', logoutCaterer);

// Profile Management Route
router.put('/profile', protectCaterer, updateCatererProfile);

// Advanced Search Route (Must be before slug/id params)
router.get('/search', searchCaterers);

// Public Slug Route
router.get('/slug/:slug', getCatererBySlug);

// GET /api/caterers       → Return all caterers
// POST /api/caterers      → Create a new caterer (with validation, keeping for backwards compatibility or admin)
router.route('/').get(getAllCaterers).post(catererValidationRules, validate, createCaterer);

// GET /api/caterers/:id   → Return single caterer by ID
router.route('/:id').get(getCatererById);

module.exports = router;
