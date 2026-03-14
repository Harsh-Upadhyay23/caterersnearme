/* Seed 15 dummy caterers into the database.
 *
 * Usage:
 *   node Backend/scripts/seedDummyCaterers.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Caterer = require('../models/Caterer');

const dummyCaterers = [
  {
    name: 'Royal Feast Caterers',
    location: 'Andheri West',
    city: 'Mumbai',
    address: 'Shop 12, Royal Plaza, Andheri West, Mumbai',
    phone: '+91 98765 10001',
    pricePerPlate: 450,
    cuisines: ['North Indian', 'Chinese', 'Mughlai'],
    services: ['Veg', 'Non-Veg', 'Wedding', 'Corporate'],
    areasServed: ['Andheri', 'Juhu', 'Bandra'],
    description: 'Premium multi-cuisine catering with focus on weddings and large events.',
    rating: 4.8,
  },
  {
    name: 'Shree Sai Caterers',
    location: 'Baner',
    city: 'Pune',
    address: 'Office 3, Green Park, Baner, Pune',
    phone: '+91 98765 10002',
    pricePerPlate: 320,
    cuisines: ['Maharashtrian', 'South Indian'],
    services: ['Veg', 'Jain', 'House Parties'],
    areasServed: ['Baner', 'Aundh', 'Pashan'],
    description: 'Authentic Maharashtrian thalis and festival-special menus.',
    rating: 4.5,
  },
  {
    name: 'Taste of Punjab',
    location: 'Rajouri Garden',
    city: 'Delhi',
    address: '15, Food Lane, Rajouri Garden, New Delhi',
    phone: '+91 98765 10003',
    pricePerPlate: 500,
    cuisines: ['North Indian', 'Punjabi', 'Tandoor'],
    services: ['Veg', 'Non-Veg', 'Wedding', 'Sangeet'],
    areasServed: ['Rajouri Garden', 'Punjabi Bagh', 'Janakpuri'],
    description: 'Heavy-duty Punjabi flavours, live tandoor and chaat counters.',
    rating: 4.7,
  },
  {
    name: 'Coastal Spice Catering',
    location: 'Velachery',
    city: 'Chennai',
    address: '22, Beach View Road, Velachery, Chennai',
    phone: '+91 98765 10004',
    pricePerPlate: 380,
    cuisines: ['South Indian', 'Seafood'],
    services: ['Non-Veg', 'Corporate', 'Family Events'],
    areasServed: ['Velachery', 'Adyar', 'OMR'],
    description: 'Coastal-special seafood spreads and traditional South Indian meals.',
    rating: 4.4,
  },
  {
    name: 'Green Leaf Veg Caterers',
    location: 'Kothrud',
    city: 'Pune',
    address: '2nd Floor, Evergreen Plaza, Kothrud, Pune',
    phone: '+91 98765 10005',
    pricePerPlate: 280,
    cuisines: ['Pure Veg', 'Jain', 'North Indian'],
    services: ['Veg', 'Jain', 'Wedding', 'Puja'],
    areasServed: ['Kothrud', 'Karve Nagar', 'Deccan'],
    description: 'Pure-veg and Jain-friendly menus for religious and family events.',
    rating: 4.3,
  },
  {
    name: 'Fusion Fiesta Catering',
    location: 'Koramangala',
    city: 'Bengaluru',
    address: '19, 1st Main Road, Koramangala, Bengaluru',
    phone: '+91 98765 10006',
    pricePerPlate: 550,
    cuisines: ['Continental', 'Italian', 'Asian'],
    services: ['Veg', 'Non-Veg', 'Corporate', 'Cocktail Parties'],
    areasServed: ['Koramangala', 'HSR Layout', 'Indiranagar'],
    description: 'Modern fusion and continental menus ideal for corporate and cocktail events.',
    rating: 4.6,
  },
  {
    name: 'Bengali Bhuri Bhoj',
    location: 'Salt Lake',
    city: 'Kolkata',
    address: 'Sector 1, Salt Lake City, Kolkata',
    phone: '+91 98765 10007',
    pricePerPlate: 360,
    cuisines: ['Bengali'],
    services: ['Veg', 'Non-Veg', 'Wedding', 'Durga Puja'],
    areasServed: ['Salt Lake', 'Rajarhat', 'Baguihati'],
    description: 'Traditional Bengali spreads with fish specials and festive bhog.',
    rating: 4.5,
  },
  {
    name: 'Hyderabadi Dum Delights',
    location: 'Banjara Hills',
    city: 'Hyderabad',
    address: 'Road No. 10, Banjara Hills, Hyderabad',
    phone: '+91 98765 10008',
    pricePerPlate: 420,
    cuisines: ['Hyderabadi', 'Mughlai'],
    services: ['Non-Veg', 'Wedding', 'Nikkah'],
    areasServed: ['Banjara Hills', 'Jubilee Hills', 'Hitech City'],
    description: 'Authentic Hyderabadi biryani, kebabs and rich Mughlai gravies.',
    rating: 4.8,
  },
  {
    name: 'Simply South Caterers',
    location: 'Whitefield',
    city: 'Bengaluru',
    address: 'No. 9, Temple Road, Whitefield, Bengaluru',
    phone: '+91 98765 10009',
    pricePerPlate: 260,
    cuisines: ['South Indian', 'Breakfast'],
    services: ['Veg', 'Breakfast', 'Corporate'],
    areasServed: ['Whitefield', 'Marathahalli', 'ITPL'],
    description: 'Idli, dosa, filter coffee and South Indian thali specialists.',
    rating: 4.2,
  },
  {
    name: 'Urban Grill & Curry',
    location: 'Goregaon East',
    city: 'Mumbai',
    address: '8, Skyline Towers, Goregaon East, Mumbai',
    phone: '+91 98765 10010',
    pricePerPlate: 390,
    cuisines: ['North Indian', 'BBQ'],
    services: ['Veg', 'Non-Veg', 'House Parties', 'Birthday'],
    areasServed: ['Goregaon', 'Malad', 'Borivali'],
    description: 'Live grill counters and North Indian curry bar for house parties.',
    rating: 4.1,
  },
  {
    name: 'Fiesta Fiesta Caterers',
    location: 'Camp',
    city: 'Pune',
    address: 'MG Road, Camp, Pune',
    phone: '+91 98765 10011',
    pricePerPlate: 340,
    cuisines: ['Multi-Cuisine'],
    services: ['Veg', 'Non-Veg', 'Corporate', 'Wedding'],
    areasServed: ['Camp', 'Koregaon Park', 'Viman Nagar'],
    description: 'Balanced multi-cuisine menu for weddings and corporate events.',
    rating: 4.0,
  },
  {
    name: 'Desi Zaika Caterers',
    location: 'Old Gurgaon',
    city: 'Gurugram',
    address: 'Sadar Bazaar, Old Gurgaon, Gurugram',
    phone: '+91 98765 10012',
    pricePerPlate: 300,
    cuisines: ['North Indian', 'Street Food'],
    services: ['Veg', 'Non-Veg', 'House Parties'],
    areasServed: ['Old Gurgaon', 'DLF Phase 1', 'Sector 14'],
    description: 'North Indian favourites with gol gappa, chaat and street-food style snacks.',
    rating: 4.1,
  },
  {
    name: 'Global Platter Events',
    location: 'Powai',
    city: 'Mumbai',
    address: 'Lake View Road, Powai, Mumbai',
    phone: '+91 98765 10013',
    pricePerPlate: 650,
    cuisines: ['Continental', 'Asian', 'Mexican'],
    services: ['Veg', 'Non-Veg', 'Corporate', 'Cocktail Parties'],
    areasServed: ['Powai', 'Ghatkopar', 'Vikhroli'],
    description: 'High-end global cuisine for premium corporate and social events.',
    rating: 4.9,
  },
  {
    name: 'Annapurna Wedding Caterers',
    location: 'Thane West',
    city: 'Thane',
    address: 'Ghodbunder Road, Thane West',
    phone: '+91 98765 10014',
    pricePerPlate: 310,
    cuisines: ['North Indian', 'Maharashtrian'],
    services: ['Veg', 'Wedding', 'Engagement'],
    areasServed: ['Thane West', 'Manpada', 'Wagle Estate'],
    description: 'Large-scale vegetarian wedding catering with traditional sweets.',
    rating: 4.3,
  },
  {
    name: 'Midnight Bites Catering',
    location: 'HSR Layout',
    city: 'Bengaluru',
    address: '27, 5th Main, HSR Layout, Bengaluru',
    phone: '+91 98765 10015',
    pricePerPlate: 280,
    cuisines: ['Fast Food', 'Chinese', 'Snacks'],
    services: ['Veg', 'Non-Veg', 'Late Night', 'House Parties'],
    areasServed: ['HSR Layout', 'BTM', 'Koramangala'],
    description: 'Perfect for late-night house parties with fast-food and Indo-Chinese snacks.',
    rating: 4.0,
  },
];

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const buildEmailFromName = (name, index, usedEmails) => {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/(^\.|\.$)+/g, '');
  const root = base || 'caterer';
  let candidate = `${root}${index + 1}@example.com`;
  let counter = 2;

  while (usedEmails.has(candidate)) {
    candidate = `${root}${index + 1}-${counter}@example.com`;
    counter += 1;
  }

  usedEmails.add(candidate);
  return candidate;
};

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const existing = await Caterer.find({}, 'slug email').lean();
    const usedSlugs = new Set(existing.map((c) => c.slug).filter(Boolean));
    const usedEmails = new Set(existing.map((c) => c.email).filter(Boolean));

    const docs = dummyCaterers.map((c, index) => {
      let baseSlug = slugify(c.name);
      let slug = baseSlug;
      let counter = 1;
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter += 1;
      }
      usedSlugs.add(slug);

      const email = buildEmailFromName(c.name, index, usedEmails);

      return {
        ...c,
        slug,
        email,
        password: 'Password@123', // default demo password
      };
    });

    await Caterer.insertMany(docs);
    console.log(`Inserted ${docs.length} dummy caterers.`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();

