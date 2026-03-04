 
const express = require("express");
const router = express.Router();
const { addTheatre, getTheatres } = require("../controllers/theatreController");
const { protect } = require("../middleware/authMiddleware");

// All routes require login
router.post("/addTheatre", protect, addTheatre);
router.get("/getTheatres", protect, getTheatres);

module.exports = router;

