 
const mongoose = require("mongoose");

const movieCastSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  cast: { type: mongoose.Schema.Types.ObjectId, ref: "Cast" },
});

module.exports = mongoose.model("MovieCast", movieCastSchema);
