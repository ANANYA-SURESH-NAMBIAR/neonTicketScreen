 
const mongoose = require("mongoose");


// const paymentSchema = new mongoose.Schema(
//   {
//     booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
//     method: String,
//     status: String,
//     // transactionId: String,
//   },
//   { timestamps: true },
// );

const paymentSchema = new mongoose.Schema(
{
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },

  method: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending","success","failed"],
    default: "pending"
  },

  amount: {
    type: Number,
    required: true
  },

  transactionId: String
},
{ timestamps: true }
);

// export default mongoose.model("Payment", paymentSchema);
module.exports = mongoose.model("Payment", paymentSchema);
