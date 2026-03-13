const Menu = require('../models/Menu');

// @desc    Get all menus for a specific caterer
// @route   GET /api/menus/caterer/:catererId
// @access  Public
const getMenusByCaterer = async (req, res, next) => {
  try {
    const menus = await Menu.find({ catererId: req.params.catererId });
    res.status(200).json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new menu
// @route   POST /api/menus
// @access  Private (Caterer only)
const createMenu = async (req, res, next) => {
  try {
    // Add caterer to req.body based on logged in user
    req.body.catererId = req.caterer.id;

    const menu = await Menu.create(req.body);

    res.status(201).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu
// @route   PUT /api/menus/:id
// @access  Private (Caterer only)
const updateMenu = async (req, res, next) => {
  try {
    let menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: `Menu not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is menu owner
    if (menu.catererId.toString() !== req.caterer.id) {
      return res.status(401).json({
        success: false,
        message: `Caterer ${req.caterer.id} is not authorized to update this menu`,
      });
    }

    menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu
// @route   DELETE /api/menus/:id
// @access  Private (Caterer only)
const deleteMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: `Menu not found with id of ${req.params.id}`,
      });
    }

    // Make sure user is menu owner
    if (menu.catererId.toString() !== req.caterer.id) {
      return res.status(401).json({
        success: false,
        message: `Caterer ${req.caterer.id} is not authorized to delete this menu`,
      });
    }

    await menu.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenusByCaterer,
  createMenu,
  updateMenu,
  deleteMenu,
};
