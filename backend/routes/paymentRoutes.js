 
const express = require("express");
const router = express.Router();
const {
  createPayment,
  getPayment,
} = require("../controllers/paymentController");

router.post("/", createPayment);
router.get("/:id", getPayment);

module.exports = router;
