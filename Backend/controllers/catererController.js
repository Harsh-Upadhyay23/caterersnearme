const Caterer = require('../models/Caterer');

// @desc    Get all caterers
// @route   GET /api/caterers
// @access  Public
const getAllCaterers = async (req, res, next) => {
  try {
    const caterers = await Caterer.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: caterers.length,
      data: caterers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single caterer by ID
// @route   GET /api/caterers/:id
// @access  Public
const getCatererById = async (req, res, next) => {
  try {
    const caterer = await Caterer.findById(req.params.id);

    if (!caterer) {
      return res.status(404).json({
        success: false,
        message: `Caterer not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: caterer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new caterer
// @route   POST /api/caterers
// @access  Public
const createCaterer = async (req, res, next) => {
  try {
    const { name, location, pricePerPlate, cuisines, rating, image } = req.body;

    const caterer = await Caterer.create({
      name,
      location,
      pricePerPlate,
      cuisines,
      rating,
      image,
    });

    res.status(201).json({
      success: true,
      message: 'Caterer created successfully',
      data: caterer,
    });
  } catch (error) {
    next(error);
  }
};

const mongoose = require('mongoose');

// @desc    Get single caterer by Slug (Public Profile)
// @route   GET /api/caterers/slug/:slug
// @access  Public
const getCatererBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let caterer = await Caterer.findOne({ slug });

    if (!caterer && mongoose.isValidObjectId(slug)) {
      caterer = await Caterer.findById(slug);
    }

    if (!caterer) {
      return res.status(404).json({
        success: false,
        message: `Caterer not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: caterer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update caterer profile
// @route   PUT /api/caterers/profile
// @access  Private (Caterer)
const updateCatererProfile = async (req, res, next) => {
  try {
    // Only allow updating specific fields
    const {
      name,
      location,
      city,
      address,
      phone,
      establishedYear,
      description,
      pricePerPlate,
      cuisines,
      services,
      areasServed,
      image,
      images
    } = req.body;

    const fieldsToUpdate = {
      name,
      location,
      city,
      address,
      phone,
      establishedYear,
      description,
      pricePerPlate,
      cuisines,
      services,
      areasServed,
      image,
      images
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

    const caterer = await Caterer.findByIdAndUpdate(
      req.caterer.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: caterer,
    });
  } catch (error) {
    next(error);
  }
};

const Menu = require('../models/Menu');

// @desc    Advanced Search Caterers
// @route   GET /api/caterers/search
// @access  Public
const searchCaterers = async (req, res, next) => {
  try {
    const { q, area, cuisine } = req.query;
    
    // Build query for Caterer model
    let catererQuery = {};
    
    if (area) {
      catererQuery.$or = [
        { location: { $regex: area, $options: 'i' } },
        { city: { $regex: area, $options: 'i' } },
        { areasServed: { $regex: area, $options: 'i' } }
      ];
    }
    
    if (cuisine) {
      catererQuery.cuisines = { $regex: cuisine, $options: 'i' };
    }
    
    let matchedCatererIds = new Set();
    let hasDishMatch = false;

    if (q) {
      // 1. Search Caterer fields (Name, description)
      const caterersMatch = await Caterer.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      }).select('_id');
      
      caterersMatch.forEach(c => matchedCatererIds.add(c._id.toString()));

      // 2. Search Menu fields (Dishes, Menu Name)
      const menusMatch = await Menu.find({
        $or: [
          { menuName: { $regex: q, $options: 'i' } },
          { dishes: { $regex: q, $options: 'i' } }
        ]
      }).select('catererId');

      menusMatch.forEach(m => {
        matchedCatererIds.add(m.catererId.toString());
        hasDishMatch = true;
      });

      // If a query was provided, restrict the caterer query to ONLY those that matched either Name, Desc, or Menu
      catererQuery._id = { $in: Array.from(matchedCatererIds) };
    }

    const caterers = await Caterer.find(catererQuery).sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: caterers.length,
      data: caterers,
      metadata: {
        dishMatchFound: hasDishMatch
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCaterers, getCatererById, getCatererBySlug, createCaterer, updateCatererProfile, searchCaterers };
