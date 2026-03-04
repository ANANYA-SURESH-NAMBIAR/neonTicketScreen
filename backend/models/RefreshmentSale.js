 
const mongoose = require("mongoose");

const refreshmentSaleSchema = new mongoose.Schema({
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre", required: true },
  refreshment: { type: mongoose.Schema.Types.ObjectId, ref: "Refreshment", required: true },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  soldAt: { type: Date, default: Date.now },
  soldBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" }
}, { timestamps: true });

module.exports = mongoose.model("RefreshmentSale", refreshmentSaleSchema);
