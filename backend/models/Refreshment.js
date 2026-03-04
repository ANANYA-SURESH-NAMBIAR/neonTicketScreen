 
const mongoose = require("mongoose");

const refreshmentSchema = new mongoose.Schema({
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre" },
  name: String,
  price: Number,
});

module.exports = mongoose.model("Refreshment", refreshmentSchema);
