 
const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  screen: { type: mongoose.Schema.Types.ObjectId, ref: "Screen" },
  // theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre", required: true },

  row: { type: String, required: true },

  col: { type: Number, required: true },
  seat_number: { type: String, required: true },

  seat_type: {
    type: String,
    enum: ["regular", "premium", "recliner"],
    default: "regular"
  },

  price: { type: Number, required: true },
});

module.exports = mongoose.model("Seat", seatSchema);
