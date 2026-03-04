const express = require("express");
const router = express.Router();
const {
  getUsers,
  getMovies,
  sendMessageToOwner,
  sendMessageToAllOwners,
  getAllMessages,
  getMessagesToOwner,
  testAdmin,
  testAdminMessage,
  sendMessage,
  addMovie,
} = require("../controllers/adminController");
const {
  getAdminRefreshmentStats,
} = require("../controllers/refreshmentController");
const {
  getRankingsToday,
  getGraphsMonthly,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");
const movieUpload = require("../middleware/movieUpload");

// All admin routes must pass 'protect' + 'admin' middleware
router.get("/users", protect, admin, getUsers);
router.get("/movies", protect, admin, getMovies);

// Analytics
router.get("/rankings", protect, admin, getRankingsToday);
router.get("/test", protect, admin, testAdmin);
router.get("/test-message", protect, admin, testAdminMessage);
router.get("/graphs/monthly", protect, admin, getGraphsMonthly);

// Admin Actions
router.post("/send-message", protect, admin, sendMessage);
router.post(
  "/add-movie",
  protect,
  admin,
  movieUpload.single("poster"),
  addMovie,
);
// Refreshment sales stats
router.get("/refreshments/sales", protect, admin, getAdminRefreshmentStats);

// Admin Messaging Routes
router.post("/messages/send", protect, admin, sendMessageToOwner);
router.post("/messages/send-all", protect, admin, sendMessageToAllOwners);
router.get("/messages", protect, admin, getAllMessages);
router.get("/messages/owner/:ownerId", protect, admin, getMessagesToOwner);

module.exports = router;
