 
const Theatre = require("../models/Theatre");
const Movie = require("../models/Movie");
const Screen = require("../models/Screen");
const Show = require("../models/Show");
const Booking = require("../models/Booking");
const Refreshment = require("../models/Refreshment");
const Accessibility = require("../models/Accessibility");
const TheatreImage = require("../models/TheatreImage");
const Seat = require("../models/Seat");
const mongoose = require("mongoose");

const getOwnerTheatre = async(userId)=>{
  return await Theatre.findOne({ owner:userId });
};

exports.dashboard = async (req,res)=>{
  const theatre = await getOwnerTheatre(req.user._id);
  if(!theatre) return res.status(404).json({msg:"Theatre not found"});
  res.json({ theatre });
};

exports.analytics = async (req,res)=>{
  const theatre = await getOwnerTheatre(req.user._id);
  if(!theatre) return res.status(404).json({msg:"Theatre not found"});

  const shows = await Show.find({ theatre: theatre._id });

  const bookings = await Booking.find({
    show:{ $in:shows.map(s=>s._id) }
  }).populate({
    path:"show",
    populate:{ path:"movie" }
  });

  const revenue = bookings.reduce((a,b)=>a+b.totalAmount,0);

  const movieCounts={};
  bookings.forEach(b=>{
    const id=b.show.movie._id.toString();
    movieCounts[id]=(movieCounts[id]||0)+1;
  });

  const topMovies = Object.entries(movieCounts)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3);

  res.json({ revenue,totalBookings:bookings.length,topMovies });
};

exports.analyticsGraphs = async (req,res)=>{
  const theatre = await getOwnerTheatre(req.user._id);
  if(!theatre) return res.status(404).json({msg:"Theatre not found"});

  const shows = await Show.find({ theatre: theatre._id });

  const bookings = await Booking.find({
    show:{ $in:shows.map(s=>s._id) }
  });

  const daily={};

  bookings.forEach(b=>{
    const d=new Date(b.createdAt).toISOString().slice(0,10);
    daily[d]=(daily[d]||0)+b.totalAmount;
  });

  res.json(daily);
};

// exports.ownerMovies = async (req,res)=>{
//   const theatre = await getOwnerTheatre(req.user._id);
//   if(!theatre) return res.status(404).json({msg:"Theatre not found"});

//   const shows = await Show.find({ theatre: theatre._id }).populate("movie");
//   res.json(shows.map(s=>s.movie));
// };


exports.ownerMovies = async (req,res)=>{
  const theatre = await getOwnerTheatre(req.user._id);
  if(!theatre) return res.status(404).json({msg:"Theatre not found"});

  // Use Show -> movie ids -> Movie lookup to avoid crashing on missing refs
  const shows = await Show.find({ theatre: theatre._id })
    .select("movie")
    .lean();

  const movieIdStrings = shows
    .map((s) => s.movie)
    .filter(Boolean)
    .map((id) => id.toString());

  const validMovieIds = movieIdStrings.filter((id) =>
    require("mongoose").Types.ObjectId.isValid(id)
  );

  const movies = await Movie.find({ _id: { $in: validMovieIds } });

  // Ensure unique movies (some shows can point to the same movie)
  const uniqueMovies = [
    ...new Map(movies.map((m) => [m._id.toString(), m])).values(),
  ];

  res.json(uniqueMovies);
};

exports.ownerBookings = async (req,res)=>{
  const theatre = await getOwnerTheatre(req.user._id);
  if(!theatre) return res.status(404).json({msg:"Theatre not found"});

  const shows = await Show.find({ theatre: theatre._id });

  const bookings = await Booking.find({
    show:{ $in:shows.map(s=>s._id) }
  }).populate("user show");

  res.json(bookings);
};

exports.ownerScreens = async (req,res)=>{
  const theatre = await getOwnerTheatre(req.user._id);
  if(!theatre) return res.status(404).json({msg:"Theatre not found"});

  const screens = await Screen.find({ theatre: theatre._id });
  res.json(screens);
};

exports.ownerShows = async (req,res)=>{
  const theatre = await getOwnerTheatre(req.user._id);
  if(!theatre) return res.status(404).json({msg:"Theatre not found"});

  const shows = await Show.find({ theatre: theatre._id })
    .populate("movie screen");

  res.json(shows);
};

// GET /api/owner/movies/:movieId  (owner-only movie details, plus show count in this theatre)
exports.ownerMovieDetails = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  const { movieId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ msg: "Invalid movie id" });
  }

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(404).json({ msg: "Movie not found" });

  const showCount = await Show.countDocuments({ theatre: theatre._id, movie: movieId });

  res.json({ movie, showCount });
};

// GET /api/owner/movies/:movieId/shows (shows for this movie in owner's theatre)
exports.ownerMovieShows = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  const { movieId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ msg: "Invalid movie id" });
  }

  const shows = await Show.find({ theatre: theatre._id, movie: movieId })
    .populate("screen", "name totalSeats")
    .sort({ date: 1, time: 1 });

  res.json(shows);
};

// GET /api/owner/movies/available (movies NOT currently listed in this theatre)
exports.ownerAvailableMovies = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  const shows = await Show.find({ theatre: theatre._id }).select("movie").lean();

  const movieIdsInTheatre = shows
    .map((s) => s.movie)
    .filter(Boolean)
    .map((id) => id.toString())
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  const movies = await Movie.find({
    _id: { $nin: movieIdsInTheatre },
  }).sort({ title: 1 });

  res.json(movies);
};

// POST /api/owner/shows (create a show for this theatre)
exports.createOwnerShow = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  const { movieId, screenId, date, time, price } = req.body;

  if (!movieId || !screenId || !time) {
    return res.status(400).json({ msg: "movieId, screenId and time are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(movieId) || !mongoose.Types.ObjectId.isValid(screenId)) {
    return res.status(400).json({ msg: "Invalid movieId or screenId" });
  }

  const [movie, screen] = await Promise.all([
    Movie.findById(movieId),
    Screen.findOne({ _id: screenId, theatre: theatre._id }),
  ]);

  if (!movie) return res.status(404).json({ msg: "Movie not found" });
  if (!screen) return res.status(404).json({ msg: "Screen not found for this theatre" });

  const showDate = date ? new Date(date) : new Date();

  const show = await Show.create({
    movie: movie._id,
    theatre: theatre._id,
    screen: screen._id,
    date: showDate,
    time,
    price: price != null ? Number(price) : undefined,
  });

  res.status(201).json(show);
};

exports.ownerRefreshments = async (req,res)=>{
  const theatre = await getOwnerTheatre(req.user._id);
  if(!theatre) return res.status(404).json({msg:"Theatre not found"});

  const items = await Refreshment.find({ theatre: theatre._id });
  res.json(items);
};

exports.editTheatre = async (req,res)=>{
  const updates={...req.body};
  delete updates.owner;

  const theatre = await Theatre.findOneAndUpdate(
    { owner:req.user._id },
    updates,
    { new:true }
  );

  res.json(theatre);
};

// Get admin messages for the owner
exports.adminMessages = async (req,res)=>{
  try {
    const theatre = await getOwnerTheatre(req.user._id);
    if(!theatre) return res.status(404).json({msg:"Theatre not found"});

    const AdminMessage = require("../models/AdminMessage");
    
    // Get all messages for this theatre owner
    const messages = await AdminMessage.find({ to: req.user._id, theatre: theatre._id })
      .populate("from", "name email")
      .populate("theatre", "name")
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark message as read
exports.markMessageAsRead = async (req,res)=>{
  try {
    const { messageId } = req.params;
    const AdminMessage = require("../models/AdminMessage");

    const message = await AdminMessage.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    ).populate("from", "name email").populate("theatre", "name");

    if (!message) return res.status(404).json({msg:"Message not found"});

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get negative reviews for the theatre
exports.theatreReviews = async (req,res)=>{
  const theatre = await getOwnerTheatre(req.user._id);
  if(!theatre) return res.status(404).json({msg:"Theatre not found"});

  const Review = require("../models/Review");
  // Return all reviews for this theatre (previously filtered only rating < 3)
  const reviews = await Review.find({ theatre: theatre._id })
    .populate("user")
    .populate("movie")
    .sort({ createdAt: -1 });

  res.json(reviews);
};

// Get detailed analytics for today
exports.analyticsDetailed = async (req,res)=>{
  const theatre = await getOwnerTheatre(req.user._id);
  if(!theatre) return res.status(404).json({msg:"Theatre not found"});

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const shows = await Show.find({ theatre: theatre._id });
  
  const bookings = await Booking.find({
    show: { $in: shows.map(s => s._id) },
    createdAt: { $gte: today, $lt: tomorrow }
  }).populate({
    path: "show",
    populate: { path: "movie screen" }
  });

  // Total Revenue
  const revenue = bookings.reduce((a, b) => a + b.totalAmount, 0);

  // Calculate Profit (Revenue - Expenses)
  // Note: Implement expense calculation based on your business logic
  const profit = revenue; // Placeholder

  // Top movies by bookings
  const movieCounts = {};
  bookings.forEach(b => {
    const id = b.show.movie._id.toString();
    movieCounts[id] = (movieCounts[id] || 0) + 1;
  });

  const topMovies = Object.entries(movieCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([movieId, count]) => ({ movieId, count }));

  // Average ratings
  const Review = require("../models/Review");
  const reviews = await Review.find({ theatre: theatre._id });
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(2)
    : 0;

  // Top screen types by earnings
  const screenTypeEarnings = {};
  bookings.forEach(b => {
    const screenType = b.show.screen?.screen_type || "Unknown";
    screenTypeEarnings[screenType] = (screenTypeEarnings[screenType] || 0) + b.totalAmount;
  });

  const topScreenTypes = Object.entries(screenTypeEarnings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, earnings]) => ({ type, earnings }));

  // Top time slots (show times)
  const timeSlotEarnings = {};
  bookings.forEach(b => {
    const time = b.show.show_time ? new Date(b.show.show_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "Unknown";
    timeSlotEarnings[time] = (timeSlotEarnings[time] || 0) + b.totalAmount;
  });

  const topTimeSlots = Object.entries(timeSlotEarnings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([time, earnings]) => ({ time, earnings }));

  // Top selling refreshments today
  const Seat = require("../models/Seat");
  const seats = await Seat.find({
    show: { $in: shows.map(s => s._id) },
    isBooked: true,
    bookedDate: { $gte: today, $lt: tomorrow }
  });

  const soldSeats = seats.length;
  const totalSeats = await Seat.countDocuments({ show: { $in: shows.map(s => s._id) } });
  const unSoldSeats = totalSeats - soldSeats;

  // Refreshment expenses/sales (placeholder implementation)
  const RefreshmentSale = require("../models/RefreshmentSale");
  const refreshmentSales = await RefreshmentSale.find({
    theatre: theatre._id,
    soldAt: { $gte: today, $lt: tomorrow }
  }).populate("refreshment");

  res.json({
    revenue,
    profit,
    totalBookings: bookings.length,
    avgRating,
    topMovies,
    topScreenTypes,
    topTimeSlots,
    seatsData: {
      sold: soldSeats,
      unsold: unSoldSeats,
      total: totalSeats
    },
    refreshmentSales
  });
};

// Get analytics graphs with monthly data
exports.analyticsGraphsMonthly = async (req,res)=>{
  const theatre = await getOwnerTheatre(req.user._id);
  if(!theatre) return res.status(404).json({msg:"Theatre not found"});

  const shows = await Show.find({ theatre: theatre._id });

  const bookings = await Booking.find({
    show: { $in: shows.map(s => s._id) }
  }).populate({
    path: "show",
    populate: { path: "movie screen" }
  });

  // Monthly revenue
  const monthlyRevenue = {};
  bookings.forEach(b => {
    const date = new Date(b.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyRevenue[key] = (monthlyRevenue[key] || 0) + b.totalAmount;
  });

  // Sold/Unsold ratio over month
  const Seat = require("../models/Seat");
  const dailySeatsRatio = {};
  bookings.forEach(b => {
    const date = new Date(b.createdAt).toISOString().slice(0, 10);
    dailySeatsRatio[date] = (dailySeatsRatio[date] || 0) + 1;
  });

  // Most sold time slots
  const timeSlots = {};
  bookings.forEach(b => {
    const time = b.show.show_time ? new Date(b.show.show_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "Unknown";
    timeSlots[time] = (timeSlots[time] || 0) + 1;
  });

  // Average ratings per month
  const Review = require("../models/Review");
  const reviews = await Review.find({ theatre: theatre._id });
  
  const monthlyAvgRatings = {};
  reviews.forEach(r => {
    const date = new Date(r.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyAvgRatings[key]) {
      monthlyAvgRatings[key] = { total: 0, count: 0 };
    }
    monthlyAvgRatings[key].total += r.rating;
    monthlyAvgRatings[key].count += 1;
  });

  const avgRatedPerMonth = Object.entries(monthlyAvgRatings).reduce((acc, [key, val]) => {
    acc[key] = (val.total / val.count).toFixed(2);
    return acc;
  }, {});

  // Top refreshments sold
  const refreshmentData = [];

  // Refreshment expenses (placeholder)
  const refreshmentExpenses = {};

  res.json({
    monthlyRevenue,
    dailySeatsRatio,
    topTimeSlots: timeSlots,
    avgRatedPerMonth,
    topRefreshments: refreshmentData,
    refreshmentExpenses
  });
};

// Get full theatre details for owner (theatre + images + accessibility + screens + seats + refreshments)
exports.ownerTheatreDetails = async (req, res) => {
  try {
    const theatre = await getOwnerTheatre(req.user._id);
    if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

    const [images, accessibilityDocs, screens, refreshments] = await Promise.all([
      TheatreImage.find({ theatre: theatre._id }),
      Accessibility.find({ theatre: theatre._id }),
      Screen.find({ theatre: theatre._id }),
      Refreshment.find({ theatre: theatre._id })
    ]);

    // Get seats for each screen
    const screenIds = screens.map(s => s._id);
    const seats = await Seat.find({ screen: { $in: screenIds } });

    const exteriorImages = images.filter(i => i.tag === "exterior");
    const interiorImages = images.filter(i => i.tag === "interior");

    res.json({
      theatre,
      exteriorImages,
      interiorImages,
      accessibilityDetails: accessibilityDocs,
      screens,
      seats,
      refreshments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add accessibility detail
exports.addAccessibility = async (req, res) => {
  try {
    const theatre = await getOwnerTheatre(req.user._id);
    if (!theatre) return res.status(404).json({ msg: "Theatre not found" });
    const doc = await Accessibility.create({ theatre: theatre._id, detail: req.body.detail });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add theatre image (supports file upload via multer/cloudinary OR manual URL)
exports.addTheatreImage = async (req, res) => {
  try {
    const theatre = await getOwnerTheatre(req.user._id);
    if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

    // If file was uploaded via multer, use Cloudinary URL; else use manual URL
    const img_url = req.file ? req.file.path : req.body.img_url;
    if (!img_url) return res.status(400).json({ msg: "No image provided" });

    const doc = await TheatreImage.create({ theatre: theatre._id, img_url, tag: req.body.tag || "exterior" });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add refreshment
exports.addRefreshment = async (req, res) => {
  try {
    const theatre = await getOwnerTheatre(req.user._id);
    if (!theatre) return res.status(404).json({ msg: "Theatre not found" });
    const doc = await Refreshment.create({ theatre: theatre._id, name: req.body.name, price: req.body.price });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add screen
exports.addScreen = async (req, res) => {
  try {
    const theatre = await getOwnerTheatre(req.user._id);
    if (!theatre) return res.status(404).json({ msg: "Theatre not found" });
    const doc = await Screen.create({
      theatre: theatre._id,
      name: req.body.name,
      totalSeats: req.body.totalSeats || 0,
      seatLayout: req.body.seatLayout || []
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add seat to a screen
exports.addSeat = async (req, res) => {
  try {
    const theatre = await getOwnerTheatre(req.user._id);
    if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

    // Verify the screen belongs to this theatre
    const screen = await Screen.findOne({ _id: req.body.screenId, theatre: theatre._id });
    if (!screen) return res.status(404).json({ msg: "Screen not found" });

    const doc = await Seat.create({
      screen: screen._id,
      row: req.body.row,
      col: req.body.col,
      seat_number: req.body.seat_number,
      seat_type: req.body.seat_type,
      price: req.body.price
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};