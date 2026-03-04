const Movie = require("../models/Movie");

const getMovies = async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
};

const addMovie = async (req, res) => {
  const movie = await Movie.create(req.body);
  res.json(movie);
};

module.exports = { getMovies, addMovie };
