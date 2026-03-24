const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  sendOTP,
  verifyOTP
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/me', protect, getMe);

module.exports = router;
