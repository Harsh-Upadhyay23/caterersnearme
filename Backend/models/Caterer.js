const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const catererSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Caterer name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    establishedYear: {
      type: Number,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [150, 'Location cannot exceed 150 characters'],
    },
    pricePerPlate: {
      type: Number,
      min: [0, 'Price cannot be negative'],
    },
    cuisines: {
      type: [String],
    },
    services: {
      type: [String], // e.g., 'Veg', 'Non-Veg', 'Jain'
    },
    areasServed: {
      type: [String],
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    images: {
      type: [String], // Multiple images for the gallery
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id
catererSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Create a slug from the name before saving
catererSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Check if slug exists, append random string if it does
    const slugExists = await mongoose.models.Caterer.findOne({ slug: this.slug, _id: { $ne: this._id } });
    if (slugExists) {
      this.slug = `${this.slug}-${Math.random().toString(36).substring(2, 7)}`;
    }
  }

  // Only hash password if it was modified
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify candidate password
catererSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Caterer = mongoose.model('Caterer', catererSchema);
module.exports = Caterer;
