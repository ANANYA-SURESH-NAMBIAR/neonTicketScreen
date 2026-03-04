 
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMyReviews, addReview } = require("../controllers/reviewController");

const {
  getHome,
  getProfile,
  getUserBookings,
  getSingleBooking,
  getReviews
} = require("../controllers/userController");

router.get("/home", protect, getHome);
router.get("/profile", protect, getProfile);
router.get("/bookings", protect, getUserBookings);
router.get("/booking/:bookingId", protect, getSingleBooking);
router.get("/reviews", protect, getReviews);
router.post("/reviews", protect, addReview);
router.get("/reviews/my", protect, getMyReviews);
router.post("/book-tickets", protect, require("../controllers/userController").bookTickets);

module.exports = router;