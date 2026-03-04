const mongoose = require("mongoose");
const City = require("../models/City");



const seedCities = async () => {
  try {
    // Clear existing cities
    await City.deleteMany({});
    
    // Insert cities
    const cityDocuments = cities.map(cityName => ({
      city_name: cityName
    }));
    
    await City.insertMany(cityDocuments);
    console.log(`Seeded ${cityDocuments.length} cities successfully`);
  } catch (error) {
    console.error('Error seeding cities:', error);
  }
};

// Connect to database and run seeding
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/screenema', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB for city seeding');
  seedCities().then(() => {
    console.log('City seeding completed');
    process.exit(0);
  }).catch((error) => {
    console.error('City seeding failed:', error);
    process.exit(1);
  });
})
.catch((error) => {
  console.error('MongoDB connection failed:', error);
  process.exit(1);
});
