const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    catererId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Caterer',
      required: true,
    },
    menuName: {
      type: String,
      required: [true, 'Menu name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Jain', 'Custom'],
      default: 'Veg',
    },
    price: {
      type: Number,
      required: [true, 'Price per person is required'],
    },
    dishes: {
      type: [String],
      required: [true, 'At least one dish must be included'],
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id
menuSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
