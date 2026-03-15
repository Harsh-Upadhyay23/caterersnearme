const Caterer = require('../models/Caterer');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// Helper to send token in HTTP-only cookie
const sendTokenResponse = (caterer, statusCode, res, message) => {
  const token = signToken(caterer._id);

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    ),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  caterer.password = undefined; // Remove password from output

  res
    .status(statusCode)
    .cookie('catererToken', token, options)
    .json({
      success: true,
      message,
      data: caterer,
      token, // Include token in response body for localStorage fallback
    });
};

// @desc    Register caterer
// @route   POST /api/caterers/register
// @access  Public
exports.registerCaterer = async (req, res, next) => {
  try {
    const { name, email, password, phone, city, address } = req.body;

    const catererExists = await Caterer.findOne({ email });
    if (catererExists) {
      return res.status(400).json({
        success: false,
        message: 'Caterer already exists with this email',
      });
    }

    const caterer = new Caterer({
      name,
      email,
      password,
      phone,
      city,
      address,
    });

    await caterer.validate();
    await caterer.save();

    try {
      sendTokenResponse(caterer, 201, res, 'Caterer registration successful');
    } catch (tokenError) {
      await Caterer.findByIdAndDelete(caterer._id);
      throw tokenError;
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login caterer
// @route   POST /api/caterers/login
// @access  Public
exports.loginCaterer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    const caterer = await Caterer.findOne({ email }).select('+password');
    if (!caterer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await caterer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    sendTokenResponse(caterer, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in caterer
// @route   GET /api/caterers/me
// @access  Private (Caterer)
exports.getMeCaterer = async (req, res, next) => {
  try {
    const caterer = await Caterer.findById(req.caterer.id);
    res.status(200).json({
      success: true,
      data: caterer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log caterer out / clear cookie
// @route   POST /api/caterers/logout
// @access  Private
exports.logoutCaterer = async (req, res, next) => {
  res.cookie('catererToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  res.status(200).json({
    success: true,
    message: 'Caterer logged out successfully',
  });
};
