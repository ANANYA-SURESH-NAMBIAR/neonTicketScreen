 
const mongoose = require("mongoose");

const castSchema = new mongoose.Schema({
  name: String,
  role: String,
  photo_url: String,
});

module.exports = mongoose.model("Cast", castSchema);
