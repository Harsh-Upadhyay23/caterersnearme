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
// @route   GET /api/caterers/search?q=&maxPrice=
// @access  Public
const searchCaterers = async (req, res, next) => {
  try {
    const { q, maxPrice } = req.query;

    let catererQuery = {};

    // ── Price filter ────────────────────────────────────────────────────────
    if (maxPrice && !isNaN(Number(maxPrice))) {
      catererQuery.pricePerPlate = { $lte: Number(maxPrice) };
    }

    if (q && q.trim()) {
      const term = q.trim();

      // 1. Search across all caterer fields in parallel
      const catererFields = await Caterer.find({
        $or: [
          { name:        { $regex: term, $options: 'i' } },
          { description: { $regex: term, $options: 'i' } },
          { city:        { $regex: term, $options: 'i' } },
          { location:    { $regex: term, $options: 'i' } },
          { areasServed: { $elemMatch: { $regex: term, $options: 'i' } } },
          { cuisines:    { $elemMatch: { $regex: term, $options: 'i' } } },
          { services:    { $elemMatch: { $regex: term, $options: 'i' } } },
        ],
      }).select('_id');

      const matchedIds = new Set(catererFields.map(c => c._id.toString()));

      // 2. Also search menus (dish names, menu names) to find caterers via food items
      const menusMatch = await Menu.find({
        $or: [
          { menuName: { $regex: term, $options: 'i' } },
          { dishes:   { $regex: term, $options: 'i' } },
        ],
      }).select('catererId');

      menusMatch.forEach(m => matchedIds.add(m.catererId.toString()));

      // Combine with any other active filters (e.g. maxPrice)
      catererQuery._id = { $in: Array.from(matchedIds) };
    }

    const caterers = await Caterer.find(catererQuery).sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: caterers.length,
      data: caterers,
    });

  } catch (error) {
    next(error);
  }
};


module.exports = { getAllCaterers, getCatererById, getCatererBySlug, createCaterer, updateCatererProfile, searchCaterers };
