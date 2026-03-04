 
const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
  theatre_type: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number,
});

module.exports = mongoose.model("Theatre", theatreSchema);
