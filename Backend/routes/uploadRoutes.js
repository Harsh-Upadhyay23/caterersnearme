const express = require('express');
const router = express.Router();
const ImageKit = require('imagekit');

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY ,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY ,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// @desc    Get ImageKit Authentication Parameters
// @route   GET /api/upload/auth
// @access  Public
router.get('/auth', (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.status(200).json({
      ...result,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ''
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get ImageKit auth parameters',
      error: error.message
    });
  }
});

module.exports = router;
