/**
 * Seed script — populates MongoDB with sample caterer data.
 * Run with: node seed.js
 * Make sure .env is configured before running.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Caterer = require('./models/Caterer');
const connectDB = require('./config/db');

const sampleCaterers = [
  {
    name: 'Spice Garden Catering',
    location: 'Mumbai, Maharashtra',
    pricePerPlate: 650,
    cuisines: ['North Indian', 'Mughlai', 'Punjabi'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop',
  },
  {
    name: 'The Royal Feast',
    location: 'Delhi, NCR',
    pricePerPlate: 1200,
    cuisines: ['Continental', 'Indian', 'Chinese'],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1414235077428-338988a2e8c0?w=800&auto=format&fit=crop',
  },
  {
    name: 'Coastal Delights',
    location: 'Goa',
    pricePerPlate: 850,
    cuisines: ['Seafood', 'Goan', 'Mediterranean'],
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop',
  },
  {
    name: 'Biryani Brothers',
    location: 'Hyderabad, Telangana',
    pricePerPlate: 450,
    cuisines: ['Hyderabadi', 'Mughlai', 'Biryani'],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop',
  },
  {
    name: 'Vedic Veg Co.',
    location: 'Ahmedabad, Gujarat',
    pricePerPlate: 300,
    cuisines: ['Gujarati', 'Jain', 'South Indian'],
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1466978913421-bac2e5e42729?w=800&auto=format&fit=crop',
  },
  {
    name: 'The Continental Kitchen',
    location: 'Bengaluru, Karnataka',
    pricePerPlate: 1800,
    cuisines: ['Italian', 'French', 'Continental'],
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&auto=format&fit=crop',
  },
  {
    name: 'Chettinad Caterers',
    location: 'Chennai, Tamil Nadu',
    pricePerPlate: 550,
    cuisines: ['Chettinad', 'South Indian', 'Tamil'],
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&auto=format&fit=crop',
  },
  {
    name: 'Nawabi Nights',
    location: 'Lucknow, Uttar Pradesh',
    pricePerPlate: 900,
    cuisines: ['Awadhi', 'Mughlai', 'North Indian'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1511795409834-432f7a170fe8?w=800&auto=format&fit=crop',
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    await Caterer.deleteMany({});
    console.log('🗑️  Existing caterers removed');
    const inserted = await Caterer.insertMany(sampleCaterers);
    console.log(`✅ ${inserted.length} caterers seeded successfully`);
    console.log(inserted.map((c) => `  → ${c.name} (${c.location})`).join('\n'));
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

seedDB();
