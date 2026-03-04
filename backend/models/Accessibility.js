 
const mongoose = require("mongoose");

const accessibilitySchema = new mongoose.Schema({
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre" },
  detail: String,
});

module.exports = mongoose.model("Accessibility", accessibilitySchema, "accessibility");
