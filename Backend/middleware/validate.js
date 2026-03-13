const { body, validationResult } = require('express-validator');

/**
 * Validation rules for creating a caterer
 */
const catererValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 150 })
    .withMessage('Location cannot exceed 150 characters'),

  body('pricePerPlate')
    .notEmpty()
    .withMessage('Price per plate is required')
    .isFloat({ min: 0 })
    .withMessage('Price per plate must be a positive number'),

  body('cuisines')
    .isArray({ min: 1 })
    .withMessage('Cuisines must be a non-empty array of strings'),

  body('cuisines.*')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Each cuisine must be a non-empty string'),

  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be a number between 0 and 5'),

  body('image')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required')
    .isURL()
    .withMessage('Image must be a valid URL'),
];

/**
 * Middleware to check validation results and return 422 on failure
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

module.exports = { catererValidationRules, validate };
