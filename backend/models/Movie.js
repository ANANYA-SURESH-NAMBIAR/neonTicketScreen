 
const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: String,
  image: String
}, { _id: false });

const movieSchema = new mongoose.Schema({
  title: String,
  duration: Number,
  language: String,
  genre: String,
  description: String,
  release_date: Date,
  age_rating: String,
  poster_url: String,
  trailer_url: String,
  cast: [personSchema],
  crew: [personSchema]
});

module.exports = mongoose.model("Movie", movieSchema);