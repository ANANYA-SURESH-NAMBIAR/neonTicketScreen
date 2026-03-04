 
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Show = require("../models/Show");
const BookedSeats = require("../models/BookedSeats");
const Seat = require("../models/Seat");
const Payment = require("../models/Payment");

const getHome = async (req,res)=>{
  res.json({
    message:"Welcome",
    user:req.user.username
  });
};

const getProfile = async (req,res)=>{
  res.json(req.user);
};

const getUserBookings = async (req,res)=>{
  const data = await Booking.find({ user:req.user._id })
  .populate({
    path:"show",
    populate:["movie","theatre","screen"]
  });

  res.json(data);
};

const getSingleBooking = async (req,res)=>{
  const data = await Booking.findOne({
    _id:req.params.bookingId,
    user:req.user._id
  }).populate("show");

  res.json(data);
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("movie", "title poster duration");

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const bookTickets = async (req, res) => {
  try {
    const { showId, selectedSeats, totalAmount, paymentMethod } = req.body;

    if (!showId || !selectedSeats || selectedSeats.length === 0) {
      return res.status(400).json({ msg: "Missing booking parameters" });
    }

    // 1. Fetch the seats to store their details in the booking
    const seatsToBook = await Seat.find({ _id: { $in: selectedSeats } });
    if (seatsToBook.length !== selectedSeats.length) {
      return res.status(400).json({ msg: "One or more seats not found in database" });
    }

    // Map seat structures for Booking schema
    const bookingSeatItems = seatsToBook.map(s => ({
      seat_number: s.seat_number,
      seat_type: s.seat_type,
      price: s.price
    }));

    // 2. Create the overarching Booking document
    const showInfo = await Show.findById(showId).populate('movie theatre');
    if (!showInfo) {
      return res.status(404).json({ msg: "Show not found" });
    }

    const booking = new Booking({
      user: req.user._id,
      show: showId,
      seats: bookingSeatItems,
      totalAmount: totalAmount || (seatsToBook.reduce((acc, s) => acc + s.price, 0)),
      movieTitle: showInfo.movie?.title,
      theatreName: showInfo.theatre?.name,
      theatreLocation: showInfo.theatre?.address || showInfo.theatre?.location,
      showTime: showInfo.time
    });

    const savedBooking = await booking.save();

    // 3. Create the BookedSeats mapped documents
    const bookedSeatsRecords = selectedSeats.map(seatId => ({
      booking: savedBooking._id,
      seat: seatId
    }));
    await BookedSeats.insertMany(bookedSeatsRecords);

    // 4. Create Payment record
    await Payment.create({
      booking: savedBooking._id,
      method: paymentMethod || "credit",
      status: "success",
      amount: savedBooking.totalAmount,
      transactionId: `TXN_${Date.now()}_${savedBooking._id.toString().slice(-6)}`
    });

    // 5. Deprecate Show available_seats count
    const show = await Show.findById(showId);
    if (show) {
      show.available_seats = Math.max(0, (show.available_seats || 0) - selectedSeats.length);
      await show.save();
    }

    res.status(201).json({ msg: "Booking successful", booking: savedBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getHome,
  getProfile,
  getUserBookings,
  getSingleBooking,
  getReviews,
  bookTickets
};