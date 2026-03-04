 
const mongoose = require("mongoose");

const movieCrewSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  crew: { type: mongoose.Schema.Types.ObjectId, ref: "Crew" },
});

module.exports = mongoose.model("MovieCrew", movieCrewSchema);
