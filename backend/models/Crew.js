 
const mongoose = require("mongoose");

const crewSchema = new mongoose.Schema({
  name: String,
  designation: String,
  photo_url: String,
});

module.exports = mongoose.model("Crew", crewSchema);
