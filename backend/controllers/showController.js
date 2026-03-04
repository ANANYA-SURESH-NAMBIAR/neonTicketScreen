 
const Show = require("../models/Show");

const createShow = async (req, res) => {
  try {
    const { movie, theatre, screen, time, price } = req.body;

    if (!movie || !theatre || !screen || !time || !price)
      return res.status(400).json({ msg: "Missing fields" });

    const show = await Show.create({
      movie,
      theatre,
      screen,
      time,
      price,
    });

    res.json(show);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getShows = async (req, res) => {
  try {
    const shows = await Show.find().populate("movie theatre");
    res.json(shows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { createShow, getShows };
