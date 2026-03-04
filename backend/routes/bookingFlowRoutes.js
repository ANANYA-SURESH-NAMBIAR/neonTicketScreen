 
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getSeats,
  processPayment,
  paymentSuccess,
  paymentFailure
} = require("../controllers/bookingFlowController");

router.get("/:showId/seats", protect, getSeats);
router.post("/:showId/payment", protect, processPayment);
router.get("/payment/success", paymentSuccess);
router.get("/payment/failure", paymentFailure);

module.exports = router;