const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verified token via HTTP-only cookie
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token || token === 'none') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Token invalid or expired.',
    });
  }
};

// Protect caterer routes
exports.protectCaterer = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.catererToken) {
    token = req.cookies.catererToken;
  }

  if (!token || token === 'none') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // We import Caterer inside to avoid circular dependency if Caterer requires authMiddleware
    const Caterer = require('../models/Caterer');
    req.caterer = await Caterer.findById(decoded.id);
    
    if (!req.caterer) {
      return res.status(401).json({
        success: false,
        message: 'Caterer not found for this token',
      });
    }
    
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Token invalid or expired.',
    });
  }
};
