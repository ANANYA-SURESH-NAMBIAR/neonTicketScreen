const mongoose = require("mongoose");
const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  const booking = await Booking.create({
    ...req.body,
    user: req.user._id,
  });
  res.json(booking);
};

// const getMyBookings = async (req, res) => {
//   const data = await Booking.find({ user: req.user.id }).populate("show");
//   console.log(data);
//   res.json(data);
// };
// const getMyBookings = async (req, res) => {
//   try {
//     console.log("Logged-in user id:", req.user.id);

//     const data = await Booking.find({
//       user: new mongoose.Types.ObjectId(req.user.id),
//     }).populate("show");

//     console.log("Bookings found:", data);
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// const getMyBookings = async (req, res) => {
//   try {
//     console.log("Logged-in user id:", req.user.id);

//     // Convert string to ObjectId
//     const userId = new mongoose.Types.ObjectId(req.user.id);

//     // const data = await Booking.find({ user: userId }).populate({
//     //   path: "show",
//     //   populate: [
//     //     { path: "movie", model: "Movie" },
//     //     { path: "theatre", model: "Theatre" },
//     //   ],
//     // });
//     const data = await Booking.find({ user: req.user.id }).populate("show");

//     console.log("Booking user id type:", typeof data[0]?.user);
// console.log("Logged-in user id type:", typeof req.user.id);

//     console.log("Bookings found:", data);
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// const getMyBookings = async (req, res) => {
//   try {
//     console.log("Logged-in user id:", req.user._id);

//     // Query using string, since Booking.user is a string
//     // const data = await Booking.find({$expr: { $eq: [{ $toString: "$user" }, req.user._id] } }).populate("show");

    

//     console.log("Bookings found:", data);
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

const getMyBookings = async (req, res) => {
  try {
    const data = await Booking.find({ user: req.user._id })
      .populate({
        path: "show",
        populate: ["movie", "theatre", "screen"]
      });

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { createBooking, getMyBookings };
