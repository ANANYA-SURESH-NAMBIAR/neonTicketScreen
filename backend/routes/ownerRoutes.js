const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const {
  dashboard,
  createTheatre,
  analytics,
  analyticsGraphs,
  analyticsDetailed,
  analyticsGraphsMonthly,
  testAnalytics,
  ownerMovies,
  ownerMovieDetails,
  ownerMovieShows,
  ownerAvailableMovies,
  createOwnerShow,
  ownerBookings,
  ownerScreens,
  ownerShows,
  ownerRefreshments,
  editTheatre,
  adminMessages,
  markMessageAsRead,
  theatreReviews,
  ownerTheatreDetails,
  addAccessibility,
  addTheatreImage,
  addRefreshment,
  addScreen,
  addSeat,
} = require("../controllers/ownerController");

router.use(protect, authorize("TheatreOwner"));

const upload = require("../middleware/upload");

// Dashboard & Messages
router.get("/dashboard", dashboard);
router.get("/messages", adminMessages);
router.patch("/messages/:messageId/read", markMessageAsRead);
router.get("/reviews", theatreReviews);

// Theatre Management
router.post("/theatre/create", createTheatre);
router.get("/theatre/details", ownerTheatreDetails);
router.post("/theatre/accessibility", addAccessibility);
router.post("/theatre/images", upload.single("image"), addTheatreImage);
router.post("/theatre/refreshments", addRefreshment);
router.post("/theatre/screens", addScreen);
router.post("/theatre/seats", addSeat);

// Analytics
router.get("/analytics", analytics);
router.get("/analytics/test", testAnalytics);
router.get("/analytics/detailed", analyticsDetailed);
router.get("/analytics/graphs", analyticsGraphs);
router.get("/analytics/graphs/monthly", analyticsGraphsMonthly);

// Movies, Bookings, Screens, Shows, Refreshments
router.get("/movies", ownerMovies);
router.get("/movies/available", ownerAvailableMovies);
router.get("/movies/:movieId", ownerMovieDetails);
router.get("/movies/:movieId/shows", ownerMovieShows);
router.get("/bookings", ownerBookings);
router.get("/screens", ownerScreens);
router.get("/shows", ownerShows);
router.post("/shows", createOwnerShow);
router.get("/refreshments", ownerRefreshments);
// Refreshment sales (owner)
const { getOwnerSales } = require("../controllers/refreshmentController");
router.get("/refreshments/sales", getOwnerSales);

// Theatre Management
router.put("/theatre/edit", editTheatre);

module.exports = router;
