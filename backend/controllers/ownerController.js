const Theatre = require("../models/Theatre");
const Movie = require("../models/Movie");
const Screen = require("../models/Screen");
const Show = require("../models/Show");
const Booking = require("../models/Booking");
const Refreshment = require("../models/Refreshment");
const RefreshmentSale = require("../models/RefreshmentSale");
const Accessibility = require("../models/Accessibility");
const TheatreImage = require("../models/TheatreImage");
const Seat = require("../models/Seat");
const mongoose = require("mongoose");

const getOwnerTheatre = async (userId) => {
  return await Theatre.findOne({ owner: userId });
};

exports.dashboard = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) {
    return res.json({
      theatre: null,
      message: "No theatre found. Please create a theatre first.",
      needsTheatre: true,
    });
  }
  res.json({ theatre, needsTheatre: false });
};

// Create theatre for owner
exports.createTheatre = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ msg: "Name and address are required" });
    }

    // Check if owner already has a theatre
    const existingTheatre = await getOwnerTheatre(req.user._id);
    if (existingTheatre) {
      return res.status(400).json({ msg: "You already have a theatre" });
    }

    // Create new theatre
    const theatre = await Theatre.create({
      name,
      address,
      owner: req.user._id,
    });

    res.status(201).json({
      msg: "Theatre created successfully",
      theatre,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.analytics = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  // Get all shows and bookings for demo purposes
  const shows = await Show.find({ theatre: theatre._id }).populate(
    "movie screen",
  );

  const bookings = await Booking.find({
    show: { $in: shows.map((s) => s._id) },
  }).populate({
    path: "show",
    populate: { path: "movie screen" },
  });

  // Get all refreshment sales for demo purposes
  const refreshmentSales = await RefreshmentSale.find({
    theatre: theatre._id,
  }).populate("refreshmentId");

  // Get all screens for seat occupancy
  const screens = await Screen.find({ theatre: theatre._id });

  // Calculate top movies from all data
  const movieRevenue = {};
  const movieBookings = {};
  bookings.forEach((b) => {
    if (b.show && b.show.movie) {
      const movieId = b.show.movie._id.toString();
      movieRevenue[movieId] = (movieRevenue[movieId] || 0) + b.totalAmount;
      movieBookings[movieId] = (movieBookings[movieId] || 0) + 1;
    }
  });

  const topMovies = Object.entries(movieRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([movieId, revenue]) => ({
      _id: movieId,
      title:
        shows.find((s) => s.movie && s.movie._id.toString() === movieId)?.movie
          ?.title || "Unknown",
      revenue,
      bookings: movieBookings[movieId] || 0,
    }));

  // Calculate top earning screen types
  const screenTypeRevenue = {};
  const screenTypeShows = {};
  shows.forEach((show) => {
    if (show.screen) {
      const screenType = show.screen.type || "Standard";
      screenTypeRevenue[screenType] =
        (screenTypeRevenue[screenType] || 0) +
        bookings
          .filter(
            (b) => b.show && b.show._id.toString() === show._id.toString(),
          )
          .reduce((sum, b) => sum + b.totalAmount, 0);
      screenTypeShows[screenType] = (screenTypeShows[screenType] || 0) + 1;
    }
  });

  const topScreenTypes = Object.entries(screenTypeRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, revenue]) => ({
      type,
      revenue,
      shows: screenTypeShows[type] || 0,
    }));

  // Calculate most sold time slots
  const timeSlotOccupancy = {};
  const timeSlotScreens = {};
  shows.forEach((show) => {
    const time = show.time;
    const showBookings = bookings.filter(
      (b) => b.show && b.show._id.toString() === show._id.toString(),
    );
    const totalSeats = show.screen ? show.screen.totalSeats : 0;
    const soldSeats = showBookings.reduce((sum, b) => sum + b.seats.length, 0);
    const occupancy =
      totalSeats > 0 ? Math.round((soldSeats / totalSeats) * 100) : 0;

    timeSlotOccupancy[time] = (timeSlotOccupancy[time] || 0 + occupancy) / 2; // Average occupancy
    timeSlotScreens[time] = (timeSlotScreens[time] || 0) + 1;
  });

  const topTimeSlots = Object.entries(timeSlotOccupancy)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([time, occupancy]) => ({
      time,
      occupancy: Math.round(occupancy),
      screens: timeSlotScreens[time] || 0,
    }));

  // Calculate top selling refreshments
  const refreshmentRevenue = {};
  const refreshmentQuantity = {};
  refreshmentSales.forEach((sale) => {
    if (sale.refreshmentId) {
      const refreshmentId = sale.refreshmentId._id.toString();
      // Since we don't have price data in sales, use refreshment price
      const refreshmentPrice = sale.refreshmentId?.price || 0;
      refreshmentRevenue[refreshmentId] =
        (refreshmentRevenue[refreshmentId] || 0) + refreshmentPrice;
      refreshmentQuantity[refreshmentId] =
        (refreshmentQuantity[refreshmentId] || 0) + 1;
    }
  });

  const topRefreshments = Object.entries(refreshmentRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([refreshmentId, revenue]) => {
      const refreshment = refreshmentSales.find(
        (s) =>
          s.refreshmentId && s.refreshmentId._id.toString() === refreshmentId,
      )?.refreshmentId;
      return {
        _id: refreshmentId,
        name: refreshment?.name || "Unknown",
        revenue,
        quantity: refreshmentQuantity[refreshmentId] || 0,
      };
    });

  // Calculate today's revenue
  const ticketRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const refreshmentRevenueTotal = Object.values(refreshmentRevenue).reduce(
    (sum, price) => sum + price,
    0,
  );
  const todayRevenue = ticketRevenue + refreshmentRevenueTotal;

  // Calculate today's profit (estimated 70% margin on tickets, 50% on refreshments)
  const ticketProfit = ticketRevenue * 0.7;
  const refreshmentProfit = refreshmentRevenueTotal * 0.5;
  const todayProfit = ticketProfit + refreshmentProfit;
  const profitMargin =
    todayRevenue > 0 ? Math.round((todayProfit / todayRevenue) * 100) : 0;

  // Calculate screen occupancy
  const screenOccupancy = screens.map((screen) => {
    const screenShows = shows.filter(
      (s) => s.screen && s.screen._id.toString() === screen._id.toString(),
    );
    const screenBookings = bookings.filter(
      (b) =>
        b.show &&
        screenShows.some((s) => s._id.toString() === b.show._id.toString()),
    );
    const soldSeats = screenBookings.reduce(
      (sum, b) => sum + b.seats.length,
      0,
    );
    const occupancyPercentage =
      screen.totalSeats > 0
        ? Math.round((soldSeats / screen.totalSeats) * 100)
        : 0;

    return {
      _id: screen._id,
      name: screen.name,
      type: screen.type || "Standard",
      totalSeats: screen.totalSeats,
      soldSeats,
      occupancyPercentage,
    };
  });

  // Calculate refreshment expenses (cost of goods sold)
  const refreshmentExpenses = Object.values(refreshmentRevenue).reduce(
    (sum, revenue) => {
      // Assuming 50% of refreshment revenue is cost
      return sum + revenue * 0.5;
    },
    0,
  );

  const refreshmentBreakdown = Object.entries(refreshmentQuantity)
    .map(([refreshmentId, quantity]) => {
      const refreshment = refreshmentSales.find(
        (s) =>
          s.refreshmentId && s.refreshmentId._id.toString() === refreshmentId,
      )?.refreshmentId;
      const revenue = refreshmentRevenue[refreshmentId] || 0;
      const cost = revenue * 0.5; // 50% cost assumption

      return {
        _id: refreshmentId,
        name: refreshment?.name || "Unknown",
        quantity,
        cost: Math.round(cost),
      };
    })
    .slice(0, 8);

  res.json({
    topMovies,
    topScreenTypes,
    topTimeSlots,
    topRefreshments,
    todayRevenue: Math.round(todayRevenue),
    ticketRevenue: Math.round(ticketRevenue),
    refreshmentRevenue: Math.round(refreshmentRevenueTotal),
    todayProfit: Math.round(todayProfit),
    profitMargin,
    screenOccupancy,
    refreshmentExpenses: Math.round(refreshmentExpenses),
    refreshmentBreakdown,
  });
};

exports.analyticsGraphs = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  const shows = await Show.find({ theatre: theatre._id });

  const bookings = await Booking.find({
    show: { $in: shows.map((s) => s._id) },
  });

  const daily = {};

  bookings.forEach((b) => {
    const d = new Date(b.createdAt).toISOString().slice(0, 10);
    daily[d] = (daily[d] || 0) + b.totalAmount;
  });

  res.json(daily);
};

// exports.ownerMovies = async (req,res)=>{
//   const theatre = await getOwnerTheatre(req.user._id);
//   if(!theatre) return res.status(404).json({msg:"Theatre not found"});

//   const shows = await Show.find({ theatre: theatre._id }).populate("movie");
//   res.json(shows.map(s=>s.movie));
// };

exports.ownerMovies = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  // Use Show -> movie ids -> Movie lookup to avoid crashing on missing refs
  const shows = await Show.find({ theatre: theatre._id })
    .select("movie")
    .lean();

  const movieIdStrings = shows
    .map((s) => s.movie)
    .filter(Boolean)
    .map((id) => id.toString());

  const validMovieIds = movieIdStrings.filter((id) =>
    require("mongoose").Types.ObjectId.isValid(id),
  );

  const movies = await Movie.find({ _id: { $in: validMovieIds } });

  // Ensure unique movies (some shows can point to the same movie)
  const uniqueMovies = [
    ...new Map(movies.map((m) => [m._id.toString(), m])).values(),
  ];

  res.json(uniqueMovies);
};

exports.ownerBookings = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  const shows = await Show.find({ theatre: theatre._id });

  const bookings = await Booking.find({
    show: { $in: shows.map((s) => s._id) },
  }).populate("user show");

  res.json(bookings);
};

exports.ownerScreens = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  const screens = await Screen.find({ theatre: theatre._id });
  res.json(screens);
};

exports.ownerShows = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  const shows = await Show.find({ theatre: theatre._id }).populate(
    "movie screen",
  );

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

  const showCount = await Show.countDocuments({
    theatre: theatre._id,
    movie: movieId,
  });

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

  const shows = await Show.find({ theatre: theatre._id })
    .select("movie")
    .lean();

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
    return res
      .status(400)
      .json({ msg: "movieId, screenId and time are required" });
  }

  if (
    !mongoose.Types.ObjectId.isValid(movieId) ||
    !mongoose.Types.ObjectId.isValid(screenId)
  ) {
    return res.status(400).json({ msg: "Invalid movieId or screenId" });
  }

  const [movie, screen] = await Promise.all([
    Movie.findById(movieId),
    Screen.findOne({ _id: screenId, theatre: theatre._id }),
  ]);

  if (!movie) return res.status(404).json({ msg: "Movie not found" });
  if (!screen)
    return res.status(404).json({ msg: "Screen not found for this theatre" });

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

exports.ownerRefreshments = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  const items = await Refreshment.find({ theatre: theatre._id });
  res.json(items);
};

exports.editTheatre = async (req, res) => {
  const updates = { ...req.body };
  delete updates.owner;

  const theatre = await Theatre.findOneAndUpdate(
    { owner: req.user._id },
    updates,
    { new: true },
  );

  res.json(theatre);
};

// Get admin messages for the owner
exports.adminMessages = async (req, res) => {
  try {
    const theatre = await getOwnerTheatre(req.user._id);
    if (!theatre) {
      return res.json([]); // Return empty array if no theatre
    }

    const AdminMessage = require("../models/AdminMessage");

    // Get all messages for this theatre owner
    const messages = await AdminMessage.find({
      to: req.user._id,
      theatre: theatre._id,
    })
      .populate("from", "name email")
      .populate("theatre", "name")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark message as read
exports.markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const AdminMessage = require("../models/AdminMessage");

    const message = await AdminMessage.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true },
    )
      .populate("from", "name email")
      .populate("theatre", "name");

    if (!message) return res.status(404).json({ msg: "Message not found" });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get negative reviews for the theatre
exports.theatreReviews = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  const Review = require("../models/Review");
  // Return all reviews for this theatre (previously filtered only rating < 3)
  const reviews = await Review.find({ theatre: theatre._id })
    .populate("user")
    .populate("movie")
    .sort({ createdAt: -1 });

  res.json(reviews);
};

// Get detailed analytics for today
exports.analyticsDetailed = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const shows = await Show.find({ theatre: theatre._id });

  const bookings = await Booking.find({
    show: { $in: shows.map((s) => s._id) },
    createdAt: { $gte: today, $lt: tomorrow },
  }).populate({
    path: "show",
    populate: { path: "movie screen" },
  });

  // Total Revenue
  const revenue = bookings.reduce((a, b) => a + b.totalAmount, 0);

  // Calculate Profit (Revenue - Expenses)
  // Note: Implement expense calculation based on your business logic
  const profit = revenue; // Placeholder

  // Top movies by bookings
  const movieCounts = {};
  bookings.forEach((b) => {
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
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(2)
      : 0;

  // Top screen types by earnings
  const screenTypeEarnings = {};
  bookings.forEach((b) => {
    const screenType = b.show.screen?.screen_type || "Unknown";
    screenTypeEarnings[screenType] =
      (screenTypeEarnings[screenType] || 0) + b.totalAmount;
  });

  const topScreenTypes = Object.entries(screenTypeEarnings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, earnings]) => ({ type, earnings }));

  // Top time slots (show times)
  const timeSlotEarnings = {};
  bookings.forEach((b) => {
    const time = b.show.show_time
      ? new Date(b.show.show_time).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Unknown";
    timeSlotEarnings[time] = (timeSlotEarnings[time] || 0) + b.totalAmount;
  });

  const topTimeSlots = Object.entries(timeSlotEarnings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([time, earnings]) => ({ time, earnings }));

  // Top selling refreshments today
  const Seat = require("../models/Seat");
  const seats = await Seat.find({
    show: { $in: shows.map((s) => s._id) },
    isBooked: true,
    bookedDate: { $gte: today, $lt: tomorrow },
  });

  const soldSeats = seats.length;
  const totalSeats = await Seat.countDocuments({
    show: { $in: shows.map((s) => s._id) },
  });
  const unSoldSeats = totalSeats - soldSeats;

  // Refreshment expenses/sales (placeholder implementation)
  const RefreshmentSale = require("../models/RefreshmentSale");
  const refreshmentSales = await RefreshmentSale.find({
    theatre: theatre._id,
    soldAt: { $gte: today, $lt: tomorrow },
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
      total: totalSeats,
    },
    refreshmentSales,
  });
};

// Get analytics graphs with monthly data
exports.analyticsGraphsMonthly = async (req, res) => {
  const theatre = await getOwnerTheatre(req.user._id);
  if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

  const shows = await Show.find({ theatre: theatre._id });

  const bookings = await Booking.find({
    show: { $in: shows.map((s) => s._id) },
  }).populate({
    path: "show",
    populate: { path: "movie screen" },
  });

  // Monthly revenue
  const monthlyRevenue = {};
  bookings.forEach((b) => {
    const date = new Date(b.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyRevenue[key] = (monthlyRevenue[key] || 0) + b.totalAmount;
  });

  // Sold/Unsold ratio over month
  const Seat = require("../models/Seat");
  const dailySeatsRatio = {};
  bookings.forEach((b) => {
    const date = new Date(b.createdAt).toISOString().slice(0, 10);
    dailySeatsRatio[date] = (dailySeatsRatio[date] || 0) + 1;
  });

  // Most sold time slots
  const timeSlots = {};
  bookings.forEach((b) => {
    const time = b.show.show_time
      ? new Date(b.show.show_time).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Unknown";
    timeSlots[time] = (timeSlots[time] || 0) + 1;
  });

  // Average ratings per month
  const Review = require("../models/Review");
  const reviews = await Review.find({ theatre: theatre._id });

  const monthlyAvgRatings = {};
  reviews.forEach((r) => {
    const date = new Date(r.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyAvgRatings[key]) {
      monthlyAvgRatings[key] = { total: 0, count: 0 };
    }
    monthlyAvgRatings[key].total += r.rating;
    monthlyAvgRatings[key].count += 1;
  });

  const avgRatedPerMonth = Object.entries(monthlyAvgRatings).reduce(
    (acc, [key, val]) => {
      acc[key] = (val.total / val.count).toFixed(2);
      return acc;
    },
    {},
  );

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
    refreshmentExpenses,
  });
};

// Get full theatre details for owner (theatre + images + accessibility + screens + seats + refreshments)
exports.ownerTheatreDetails = async (req, res) => {
  try {
    const theatre = await getOwnerTheatre(req.user._id);
    if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

    const [images, accessibilityDocs, screens, refreshments] =
      await Promise.all([
        TheatreImage.find({ theatre: theatre._id }),
        Accessibility.find({ theatre: theatre._id }),
        Screen.find({ theatre: theatre._id }),
        Refreshment.find({ theatre: theatre._id }),
      ]);

    // Get seats for each screen
    const screenIds = screens.map((s) => s._id);
    const seats = await Seat.find({ screen: { $in: screenIds } });

    const exteriorImages = images.filter((i) => i.tag === "exterior");
    const interiorImages = images.filter((i) => i.tag === "interior");

    res.json({
      theatre,
      exteriorImages,
      interiorImages,
      accessibilityDetails: accessibilityDocs,
      screens,
      seats,
      refreshments,
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
    const doc = await Accessibility.create({
      theatre: theatre._id,
      detail: req.body.detail,
    });
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

    const doc = await TheatreImage.create({
      theatre: theatre._id,
      img_url,
      tag: req.body.tag || "exterior",
    });
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
    const doc = await Refreshment.create({
      theatre: theatre._id,
      name: req.body.name,
      price: req.body.price,
    });
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
      seatLayout: req.body.seatLayout || [],
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Test endpoint for debugging
exports.testAnalytics = async (req, res) => {
  try {
    res.json({
      message: "Analytics endpoint is working",
      user: req.user._id,
      timestamp: new Date(),
    });
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
    const screen = await Screen.findOne({
      _id: req.body.screenId,
      theatre: theatre._id,
    });
    if (!screen) return res.status(404).json({ msg: "Screen not found" });

    const doc = await Seat.create({
      screen: screen._id,
      row: req.body.row,
      col: req.body.col,
      seat_number: req.body.seat_number,
      seat_type: req.body.seat_type,
      price: req.body.price,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
