 
const express = require("express");
const router = express.Router();

const publicController = require("../controllers/publicController");

router.get("/", publicController.getCities);
router.get("/movies", publicController.getMovies);
router.get("/movie/:movieId", publicController.getMovieDetails);
router.get("/movie/:movieId/reviews", publicController.getMovieReviews);
router.get("/movie/:movieId/shows", publicController.getMovieShows);
router.get("/theatre/:theatreId", publicController.getTheatreDetails);
router.get("/show/:showId", publicController.getShowDetails);

module.exports = router;