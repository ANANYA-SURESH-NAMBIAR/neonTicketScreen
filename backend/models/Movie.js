const mongoose = require("mongoose");

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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Movie", movieSchema);
