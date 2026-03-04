 
const express = require("express");
const router = express.Router();
const { 
  getUsers, 
  getMovies, 
  sendMessageToOwner,
  sendMessageToAllOwners,
  getAllMessages,
  getMessagesToOwner
} = require("../controllers/adminController");
const { getAdminRefreshmentStats } = require("../controllers/refreshmentController");
const { getRankingsToday, getGraphsMonthly } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// All admin routes must pass 'protect' + 'admin' middleware
router.get("/users", protect, admin, getUsers);
router.get("/movies", protect, admin, getMovies);

// Analytics
router.get("/rankings", protect, admin, getRankingsToday);
router.get("/graphs/monthly", protect, admin, getGraphsMonthly);
// Refreshment sales stats
router.get("/refreshments/sales", protect, admin, getAdminRefreshmentStats);

// Admin Messaging Routes
router.post("/messages/send", protect, admin, sendMessageToOwner);
router.post("/messages/send-all", protect, admin, sendMessageToAllOwners);
router.get("/messages", protect, admin, getAllMessages);
router.get("/messages/owner/:ownerId", protect, admin, getMessagesToOwner);

module.exports = router;
