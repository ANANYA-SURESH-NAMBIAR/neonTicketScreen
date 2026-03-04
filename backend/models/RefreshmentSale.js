const mongoose = require("mongoose");

const refreshmentSaleSchema = new mongoose.Schema(
  {
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },
    refreshmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Refreshment",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RefreshmentSale", refreshmentSaleSchema);
