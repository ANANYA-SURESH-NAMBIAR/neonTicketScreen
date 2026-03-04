 
const mongoose = require("mongoose");

const bookedSeatsSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  seat: { type: mongoose.Schema.Types.ObjectId, ref: "Seat" },
});

module.exports = mongoose.model("BookedSeats", bookedSeatsSchema);
