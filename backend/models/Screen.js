 
const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  seatLayout: [
    {
      row: String,
      seats: Number,
    },
  ],
});

module.exports = mongoose.model("Screen", screenSchema);
