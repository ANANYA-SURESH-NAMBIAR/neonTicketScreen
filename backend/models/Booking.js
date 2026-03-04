 
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },
    seats: [
      {
        seat_number: String,
        seat_type: String,
        price: Number
      },
    ],
    totalAmount: Number,
    movieTitle: String,
    theatreName: String,
    theatreLocation: String,
    showTime: String,
    status: { type: String, default: "Booked" },
  },
  { timestamps: true },
);

// export default mongoose.model("Booking", bookingSchema);
module.exports = mongoose.model("Booking", bookingSchema);
