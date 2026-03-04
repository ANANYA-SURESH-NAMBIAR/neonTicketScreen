 
const mongoose = require("mongoose");

const theatreImageSchema = new mongoose.Schema({
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre" },
  img_url: String,
  tag: { type: String, enum: ["exterior", "interior"] },
});

module.exports = mongoose.model("TheatreImage", theatreImageSchema, "theatre_images");
