 
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre" },
    rating: Number,
    review_text: String,
  },
  { timestamps: true },
);

// export default mongoose.model("Review", reviewSchema);
module.exports = mongoose.model("Review", reviewSchema);
