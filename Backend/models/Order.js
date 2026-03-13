const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // Customer Details
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
    },
    // Event Details
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    eventLocation: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [10, 'Minimum 10 guests required'],
    },
    specialInstructions: {
      type: String,
      trim: true,
    },
    // Order Details
    catererId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Caterer',
      required: true,
    },
    catererName: {
      type: String,
      required: true,
    },
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
    },
    menuName: {
      type: String,
      required: true,
    },
    pricePerPerson: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    // Status
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
