const User = require("../models/User");
const Movie = require("../models/Movie");
const Theatre = require("../models/Theatre");
const AdminMessage = require("../models/AdminMessage");
const Booking = require("../models/Booking");
const Show = require("../models/Show");
const Screen = require("../models/Screen");
const Review = require("../models/Review");
const Refreshment = require("../models/Refreshment");

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all movies (admin view)
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Send message to theatre owner
const sendMessageToOwner = async (req, res) => {
  try {
    const { ownerId, theatreId, subject, message, messageType = "info", priority = "medium" } = req.body;

    // Validate required fields
    if (!ownerId || !theatreId || !subject || !message) {
      return res.status(400).json({ msg: "Missing required fields: ownerId, theatreId, subject, message" });
    }

    // Verify theatre exists and belongs to owner
    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ msg: "Theatre not found" });
    }

    if (theatre.owner.toString() !== ownerId) {
      return res.status(400).json({ msg: "Theatre does not belong to this owner" });
    }

    // Create message
    const newMessage = await AdminMessage.create({
      from: req.user._id,
      to: ownerId,
      theatre: theatreId,
      subject,
      message,
      messageType,
      priority,
    });

    // Populate and return
    await newMessage.populate("from", "name email");
    await newMessage.populate("to", "name email");
    await newMessage.populate("theatre", "name");

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send message to all theatre owners
const sendMessageToAllOwners = async (req, res) => {
  try {
    const { subject, message, messageType = "info", priority = "medium" } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ msg: "Missing required fields: subject, message" });
    }

    // Get all theatre owners
    const theatres = await Theatre.find();
    const messages = [];

    for (const theatre of theatres) {
      const newMessage = await AdminMessage.create({
        from: req.user._id,
        to: theatre.owner,
        theatre: theatre._id,
        subject,
        message,
        messageType,
        priority,
      });
      messages.push(newMessage);
    }

    res.status(201).json({ count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all messages sent by admin
const getAllMessages = async (req, res) => {
  try {
    const messages = await AdminMessage.find({ from: req.user._id })
      .populate("to", "name email")
      .populate("theatre", "name")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages sent to specific theatre owner
const getMessagesToOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const messages = await AdminMessage.find({ to: ownerId })
      .populate("from", "name email")
      .populate("theatre", "name")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Rankings - today's analytics (overview)
const getRankingsToday = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate()+1);

    const bookings = await Booking.find({ createdAt: { $gte: today, $lt: tomorrow } })
      .populate({ path: "show", populate: [{ path: "movie" }, { path: "screen" }, { path: "theatre" }] });

    const revenue = bookings.reduce((s,b)=>s+(b.totalAmount||0),0);

    // Top movies
    const movieCounts = {};
    bookings.forEach(b=>{
      const m = b.show?.movie?._id?.toString();
      if(m) movieCounts[m] = (movieCounts[m]||0)+ (b.seats?.length||1);
    });
    const topMovies = Object.entries(movieCounts).sort((a,b)=>b[1]-a[1]).slice(0,3);

    // Top earning screen types
    const screenEarnings = {};
    bookings.forEach(b=>{
      const type = b.show?.screen?.screen_type || "Unknown";
      screenEarnings[type] = (screenEarnings[type]||0) + (b.totalAmount||0);
    });
    const topScreenTypes = Object.entries(screenEarnings).sort((a,b)=>b[1]-a[1]).slice(0,5);

    // Top earning theatre types (theatre.theatre_type is string)
    const theatreTypeEarnings = {};
    bookings.forEach(b=>{
      const ttype = b.show?.theatre?.theatre_type || "Unknown";
      theatreTypeEarnings[ttype] = (theatreTypeEarnings[ttype]||0) + (b.totalAmount||0);
    });
    const topTheatreTypes = Object.entries(theatreTypeEarnings).sort((a,b)=>b[1]-a[1]).slice(0,5);

    // Top time slots
    const timeSlotCounts = {};
    bookings.forEach(b=>{
      const time = b.show?.time || (b.show?.date? new Date(b.show.date).toISOString().slice(11,16): "Unknown");
      timeSlotCounts[time] = (timeSlotCounts[time]||0) + (b.seats?.length||1);
    });
    const topTimeSlots = Object.entries(timeSlotCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);

    // Avg ratings today
    const reviews = await Review.find({ createdAt: { $gte: today, $lt: tomorrow } });
    const avgRating = reviews.length ? (reviews.reduce((s,r)=>s+(Number(r.rating)||0),0)/reviews.length).toFixed(2) : null;

    // All theatres sold:unsold ratio today
    const theatres = await Theatre.find();
    const theatreSeatStats = [];
    for(const t of theatres){
      const screens = await Screen.find({ theatre: t._id });
      const totalSeats = screens.reduce((s,sc)=>s+(sc.totalSeats||0),0);
      const theatreShows = await Show.find({ theatre: t._id }).select("_id");
      const theatreBookings = await Booking.find({ show: { $in: theatreShows.map(x=>x._id) }, createdAt: { $gte: today, $lt: tomorrow } });
      const sold = theatreBookings.reduce((s,b)=>s + (b.seats?.length||0),0);
      theatreSeatStats.push({ theatreId: t._id, name: t.name, sold, unsold: Math.max(totalSeats-sold,0), totalSeats });
    }

    // Refreshment sales/expenses - use RefreshmentSale if available
    const RefreshmentSale = require("../models/RefreshmentSale");
    const rfSales = await RefreshmentSale.find({ soldAt: { $gte: today, $lt: tomorrow } }).populate("refreshment theatre");
    const refreshmentStats = rfSales.map(s => ({ theatre: s.theatre?._id, theatreName: s.theatre?.name, item: s.refreshment?.name, qty: s.quantity, revenue: s.totalPrice }));

    res.json({ revenue, profit: revenue, totalBookings: bookings.length, topMovies, avgRating, topScreenTypes, topTheatreTypes, topTimeSlots, theatreSeatStats, refreshmentStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin graphs - monthly aggregates (last 30 days)
const getGraphsMonthly = async (req, res) => {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate()-30);

    const bookings = await Booking.find({ createdAt: { $gte: start, $lte: end } })
      .populate({ path: "show", populate: [{ path: "movie" }, { path: "screen" }, { path: "theatre" }] });

    // daily revenue
    const dailyRevenue = {};
    bookings.forEach(b=>{
      const d = new Date(b.createdAt).toISOString().slice(0,10);
      dailyRevenue[d] = (dailyRevenue[d]||0) + (b.totalAmount||0);
    });

    // top movies over month
    const movieCounts = {};
    bookings.forEach(b=>{
      const m = b.show?.movie?._id?.toString();
      if(m) movieCounts[m] = (movieCounts[m]||0) + (b.seats?.length||1);
    });
    const topMovies = Object.entries(movieCounts).sort((a,b)=>b[1]-a[1]).slice(0,10);

    // profits = revenue (placeholder)
    const monthlyProfit = dailyRevenue;

    // best performing theatres
    const theatreRevenue = {};
    bookings.forEach(b=>{
      const tid = b.show?.theatre?._id?.toString() || 'unknown';
      theatreRevenue[tid] = (theatreRevenue[tid]||0) + (b.totalAmount||0);
    });

    // top screen types
    const screenEarnings = {};
    bookings.forEach(b=>{
      const type = b.show?.screen?.screen_type || 'Unknown';
      screenEarnings[type] = (screenEarnings[type]||0) + (b.totalAmount||0);
    });

    // avg ratings per day over month
    const reviews = await Review.find({ createdAt: { $gte: start, $lte: end } });
    const dailyRatings = {};
    reviews.forEach(r=>{
      const d = new Date(r.createdAt).toISOString().slice(0,10);
      if(!dailyRatings[d]) dailyRatings[d] = { total:0, count:0 };
      dailyRatings[d].total += Number(r.rating)||0;
      dailyRatings[d].count += 1;
    });
    const avgRatedPerDay = Object.fromEntries(Object.entries(dailyRatings).map(([k,v])=>[k, (v.total/v.count).toFixed(2)]));

    res.json({ dailyRevenue, topMovies, monthlyProfit, theatreRevenue, screenEarnings, avgRatedPerDay });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getMovies, sendMessageToOwner, sendMessageToAllOwners, getAllMessages, getMessagesToOwner, getRankingsToday, getGraphsMonthly };
