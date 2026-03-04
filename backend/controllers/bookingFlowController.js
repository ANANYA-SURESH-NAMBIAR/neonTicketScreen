const Seat = require("../models/Seat");
const Show = require("../models/Show");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const BookedSeats = require("../models/BookedSeats");
const RefreshmentSale = require("../models/RefreshmentSale");
const Refreshment = require("../models/Refreshment");

const getSeats = async (req,res)=>{
  const show = await Show.findById(req.params.showId);
  if(!show) return res.status(404).json({ msg: "Show not found" });

  const seats = await Seat.find({ screen: show.screen });

  res.json({ show, seats });
};

// const processPayment = async (req,res)=>{
//   try{
//     const { seats,totalAmount,method } = req.body;

//     // 1️⃣ create booking
//     const booking = await Booking.create({
//       user:req.user._id,
//       show:req.params.showId,
//       seats,
//       totalAmount,
//       status:"Booked"
//     });

//     // 2️⃣ create payment document
//     const payment = await Payment.create({
//       booking: booking._id,
//       method,
//       status:"success"
//     });

//     res.json({
//       message:"Payment success",
//       booking,
//       payment
//     });

//   }catch(err){
//     console.error(err);
//     res.status(500).json({msg:"Server error"});
//   }
// };

// const paymentSuccess = (req,res)=>{
//   res.json({message:"Payment Successful"});
// };

// const paymentFailure = (req,res)=>{
//   res.json({message:"Payment Failed"});
// };

// const processPayment = async (req,res)=>{
//   const { seats,totalAmount,method,status } = req.body;

//   const booking = await Booking.create({
//     user:req.user._id,
//     show:req.params.showId,
//     seats,
//     totalAmount
//   });

//   const payment = await Payment.create({
//     booking: booking._id,
//     method,
//     status
//   });

//   res.json({
//     message:"Payment success",
//     booking,
//     payment
//   });
// };

const processPayment = async (req,res)=>{
  try{
    const { seats,totalAmount,method,status,transactionId,refreshments } = req.body;

    if(!seats || !totalAmount || !method)
      return res.status(400).json({msg:"Missing required fields"});

    // load show to get theatre info
    const show = await Show.findById(req.params.showId);
    if(!show) return res.status(404).json({ msg: "Show not found" });

    // 1️⃣ Create booking
    const booking = await Booking.create({
      user:req.user._id,
      show:req.params.showId,
      seats,
      totalAmount
    });

    // 2️⃣ Create payment
    const payment = await Payment.create({
      booking: booking._id,
      method,
      status,
      amount: totalAmount,
      transactionId
    });

    // 3️⃣ Record refreshment sales if provided (array of { refreshmentId, quantity, unitPrice? })
    let recordedSales = [];
    if(Array.isArray(refreshments) && refreshments.length){
      for(const item of refreshments){
        try{
          const { refreshmentId, quantity = 1, unitPrice } = item;
          if(!refreshmentId) continue;

          const ref = await Refreshment.findById(refreshmentId);
          if(!ref) continue;

          const price = unitPrice != null ? Number(unitPrice) : Number(ref.price || 0);
          const qty = Number(quantity) || 1;
          const total = price * qty;

          const sale = await RefreshmentSale.create({
            theatre: show.theatre,
            refreshment: refreshmentId,
            quantity: qty,
            unitPrice: price,
            totalPrice: total,
            soldBy: req.user ? req.user._id : undefined,
            booking: booking._id
          });

          recordedSales.push(sale);
        }catch(err){
          console.error('Error recording refreshment sale', err);
        }
      }
    }

    res.json({
      message:"Payment success",
      booking,
      payment,
      refreshmentSales: recordedSales
    });

  }catch(err){
    console.error(err);
    res.status(500).json({msg:"Server error"});
  }
};

  const paymentSuccess = (req,res)=>{
  res.json({message:"Payment Successful"});
};

const paymentFailure = (req,res)=>{
  res.json({message:"Payment Failed"});
};

module.exports = {
  getSeats,
  processPayment,
  paymentSuccess,
  paymentFailure
};