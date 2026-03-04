const City = require("../models/City");
const Movie = require("../models/Movie");
const Theatre = require("../models/Theatre");
const Show = require("../models/Show");
const Seat = require("../models/Seat");
const BookedSeats = require("../models/BookedSeats");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

// GET /
exports.getCities = async (req, res) => {
  try {
    const cities = await City.find().select("city_name");
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /movies?city=cityName
exports.getMovies = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      const movies = await Movie.find();
      return res.json(movies);
    }

    // theatres in city
    const theatres = await Theatre.find({ city });

    const theatreIds = theatres.map((t) => t._id);

    // shows in those theatres
    const shows = await Show.find({
      theatre: { $in: theatreIds },
    }).populate("movie");

    // unique movies
    const movies = [];
    const seen = new Set();

    shows.forEach((s) => {
      if (!seen.has(s.movie._id.toString())) {
        seen.add(s.movie._id.toString());
        movies.push(s.movie);
      }
    });

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /movie/:id
exports.getMovieDetails = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /theatre/:id
exports.getTheatreDetails = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.theatreId);
    if (!theatre) return res.status(404).json({ msg: "Not found" });

    const Refreshment = require("../models/Refreshment");
    const TheatreImage = require("../models/TheatreImage");
    const Accessibility = require("../models/Accessibility");

    const [refreshments, images, accessibilityDocs] = await Promise.all([
      Refreshment.find({ theatre: theatre._id }),
      TheatreImage.find({ theatre: theatre._id }),
      Accessibility.find({ theatre: theatre._id }),
    ]);

    const exteriorImages = images
      .filter((i) => i.tag === "exterior")
      .map((i) => i.img_url);
    const interiorImages = images
      .filter((i) => i.tag === "interior")
      .map((i) => i.img_url);
    const accessibilityDetails = accessibilityDocs.map((a) => a.detail);

    res.json({
      theatre,
      refreshments,
      exteriorImages,
      interiorImages,
      accessibilityDetails,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /show/:id
exports.getShowDetails = async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId)
      .populate("movie")
      .populate("theatre");

    if (!show) return res.status(404).json({ msg: "Show not found" });

    // seats → via screen
    const seats = await Seat.find({ screen: show.screen });

    // bookings of this show
    const bookings = await Booking.find({ show: show._id });

    const bookingIds = bookings.map((b) => b._id);

    // booked seats
    const booked = await BookedSeats.find({
      booking: { $in: bookingIds },
    });

    const bookedSeatIds = booked.map((b) => b.seat.toString());

    const resultSeats = seats.map((seat) => ({
      ...seat.toObject(),
      booked: bookedSeatIds.includes(seat._id.toString()),
    }));

    res.json({
      show,
      seats: resultSeats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /movie/:movieId/shows
exports.getMovieShows = async (req, res) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId })
      .populate("theatre")
      .sort({ time: 1 });
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /movie/:movieId/reviews
exports.getMovieReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /theatres
exports.getTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find().select("name location city owner");
    res.json(theatres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
