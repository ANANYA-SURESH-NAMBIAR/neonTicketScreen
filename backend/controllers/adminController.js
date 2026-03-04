const User = require("../models/User");
const Movie = require("../models/Movie");
const Theatre = require("../models/Theatre");
const AdminMessage = require("../models/AdminMessage");
const Booking = require("../models/Booking");
const Show = require("../models/Show");
const Screen = require("../models/Screen");
const Review = require("../models/Review");
const Refreshment = require("../models/Refreshment");
const RefreshmentSale = require("../models/RefreshmentSale");

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
    const {
      ownerId,
      theatreId,
      subject,
      message,
      messageType = "info",
      priority = "medium",
    } = req.body;

    // Validate required fields
    if (!ownerId || !theatreId || !subject || !message) {
      return res.status(400).json({
        msg: "Missing required fields: ownerId, theatreId, subject, message",
      });
    }

    // Verify theatre exists and belongs to owner
    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ msg: "Theatre not found" });
    }

    if (theatre.owner.toString() !== ownerId) {
      return res
        .status(400)
        .json({ msg: "Theatre does not belong to this owner" });
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
    const {
      subject,
      message,
      messageType = "info",
      priority = "medium",
    } = req.body;

    if (!subject || !message) {
      return res
        .status(400)
        .json({ msg: "Missing required fields: subject, message" });
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
    // Get all shows and bookings for demo purposes (no theatre filtering)
    const shows = await Show.find({}).populate("movie screen theatre");

    const bookings = await Booking.find({
      show: { $in: shows.map((s) => s._id) },
    }).populate({
      path: "show",
      populate: { path: "movie screen theatre" },
    });

    // Get all refreshment sales for demo purposes
    const refreshmentSales = await RefreshmentSale.find({}).populate(
      "refreshmentId",
    );

    // Get all screens for seat occupancy
    const screens = await Screen.find({});

    // Calculate top movies from all data
    const movieRevenue = {};
    const movieBookings = {};
    bookings.forEach((b) => {
      if (b.show && b.show.movie) {
        const movieId = b.show.movie._id.toString();
        movieRevenue[movieId] =
          (movieRevenue[movieId] || 0) + (b.totalAmount || 0);
        movieBookings[movieId] =
          (movieBookings[movieId] || 0) + (b.seats?.length || 1);
      }
    });

    const topMovies = Object.entries(movieRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([movieId, revenue]) => ({
        _id: movieId,
        title:
          shows.find((s) => s.movie && s.movie._id.toString() === movieId)
            ?.movie?.title || "Unknown",
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
      const soldSeats = showBookings.reduce(
        (sum, b) => sum + b.seats.length,
        0,
      );
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

    // Calculate best performing theatres
    const theatreRevenue = {};
    const theatreOccupancy = {};
    shows.forEach((show) => {
      if (show.theatre) {
        const theatreId = show.theatre._id.toString();
        const showRevenue = bookings
          .filter(
            (b) => b.show && b.show._id.toString() === show._id.toString(),
          )
          .reduce((sum, b) => sum + b.totalAmount, 0);
        theatreRevenue[theatreId] =
          (theatreRevenue[theatreId] || 0) + showRevenue;

        if (!theatreOccupancy[theatreId]) {
          theatreOccupancy[theatreId] = { totalSeats: 0, soldSeats: 0 };
        }
        theatreOccupancy[theatreId].totalSeats += show.screen
          ? show.screen.totalSeats
          : 0;
        theatreOccupancy[theatreId].soldSeats += bookings
          .filter(
            (b) => b.show && b.show._id.toString() === show._id.toString(),
          )
          .reduce((sum, b) => sum + b.seats.length, 0);
      }
    });

    const topTheatres = Object.entries(theatreRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theatreId, revenue]) => {
        const theatre = shows.find(
          (s) => s.theatre && s.theatre._id.toString() === theatreId,
        )?.theatre;
        const occupancy = theatreOccupancy[theatreId];
        const occupancyPercentage =
          occupancy.totalSeats > 0
            ? Math.round((occupancy.soldSeats / occupancy.totalSeats) * 100)
            : 0;

        return {
          _id: theatreId,
          name: theatre?.name || "Unknown",
          location: theatre?.location || "Unknown",
          revenue,
          occupancy: occupancyPercentage,
        };
      });

    // Calculate theatre occupancy for all theatres
    const theatres = await Theatre.find({});
    const theatreOccupancyData = [];
    for (const theatre of theatres) {
      const theatreShows = shows.filter(
        (s) => s.theatre && s.theatre._id.toString() === theatre._id.toString(),
      );
      const theatreBookings = bookings.filter(
        (b) =>
          b.show &&
          theatreShows.some((s) => s._id.toString() === b.show._id.toString()),
      );

      const theatreScreens = screens.filter(
        (screen) =>
          screen.theatre &&
          screen.theatre.toString() === theatre._id.toString(),
      );
      const totalSeats = theatreScreens.reduce(
        (sum, screen) => sum + (screen.totalSeats || 0),
        0,
      );
      const soldSeats = theatreBookings.reduce(
        (sum, b) => sum + b.seats.length,
        0,
      );
      const occupancyPercentage =
        totalSeats > 0 ? Math.round((soldSeats / totalSeats) * 100) : 0;

      theatreOccupancyData.push({
        _id: theatre._id,
        name: theatre.name,
        location: theatre.location || "Unknown",
        totalSeats,
        soldSeats,
        occupancyPercentage,
      });
    }

    // Calculate top selling refreshments (using simplified data structure)
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

    res.json({
      topMovies,
      topScreenTypes,
      topTimeSlots,
      topTheatres,
      theatreOccupancy: theatreOccupancyData,
      topRefreshments,
      todayRevenue: Math.round(todayRevenue),
      ticketRevenue: Math.round(ticketRevenue),
      refreshmentRevenue: Math.round(refreshmentRevenueTotal),
      todayProfit: Math.round(todayProfit),
      profitMargin,
    });
  } catch (error) {
    console.error("Rankings error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin graphs - monthly aggregates (last 30 days)
const getGraphsMonthly = async (req, res) => {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    const bookings = await Booking.find({
      createdAt: { $gte: start, $lte: end },
    }).populate({
      path: "show",
      populate: [{ path: "movie" }, { path: "screen" }, { path: "theatre" }],
    });

    // daily revenue
    const dailyRevenue = {};
    bookings.forEach((b) => {
      const d = new Date(b.createdAt).toISOString().slice(0, 10);
      dailyRevenue[d] = (dailyRevenue[d] || 0) + (b.totalAmount || 0);
    });

    // top movies over month
    const movieCounts = {};
    bookings.forEach((b) => {
      const m = b.show?.movie?._id?.toString();
      if (m) movieCounts[m] = (movieCounts[m] || 0) + (b.seats?.length || 1);
    });
    const topMovies = Object.entries(movieCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // profits = revenue (placeholder)
    const monthlyProfit = dailyRevenue;

    // best performing theatres
    const theatreRevenue = {};
    bookings.forEach((b) => {
      const tid = b.show?.theatre?._id?.toString() || "unknown";
      theatreRevenue[tid] = (theatreRevenue[tid] || 0) + (b.totalAmount || 0);
    });

    // top screen types
    const screenEarnings = {};
    bookings.forEach((b) => {
      const type = b.show?.screen?.screen_type || "Unknown";
      screenEarnings[type] = (screenEarnings[type] || 0) + (b.totalAmount || 0);
    });

    // avg ratings per day over month
    const reviews = await Review.find({
      createdAt: { $gte: start, $lte: end },
    });
    const dailyRatings = {};
    reviews.forEach((r) => {
      const d = new Date(r.createdAt).toISOString().slice(0, 10);
      if (!dailyRatings[d]) dailyRatings[d] = { total: 0, count: 0 };
      dailyRatings[d].total += Number(r.rating) || 0;
      dailyRatings[d].count += 1;
    });
    const avgRatedPerDay = Object.fromEntries(
      Object.entries(dailyRatings).map(([k, v]) => [
        k,
        (v.total / v.count).toFixed(2),
      ]),
    );

    res.json({
      dailyRevenue,
      topMovies,
      monthlyProfit,
      theatreRevenue,
      screenEarnings,
      avgRatedPerDay,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Test endpoint for debugging
const testAdmin = async (req, res) => {
  try {
    res.json({
      message: "Admin routes are working",
      user: req.user._id,
      timestamp: new Date(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Test endpoint for debugging AdminMessage creation
const testAdminMessage = async (req, res) => {
  try {
    console.log("testAdminMessage called");
    console.log("User:", req.user);

    // Test creating a simple AdminMessage
    const testMessage = {
      from: req.user._id,
      to: req.user._id, // Send to self for testing
      theatre: "507f1f77bcf86cd799439011", // Dummy theatre ID
      subject: "Test Message",
      message: "This is a test message",
      messageType: "info",
      priority: "medium",
    };

    console.log("Creating test message:", testMessage);

    const newMessage = await AdminMessage.create(testMessage);
    console.log("Test message created:", newMessage);

    res.json({
      success: true,
      message: "Test AdminMessage created successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Test AdminMessage error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Send message to theatre owners
const sendMessage = async (req, res) => {
  try {
    console.log("sendMessage called with body:", req.body);
    console.log("User from auth middleware:", req.user);

    const { subject, message, ownerId, theatreId, priority, messageType } =
      req.body;

    if (!message) {
      console.log("Error: Message content is required");
      return res.status(400).json({ msg: "Message content is required" });
    }

    // For specific theatre message
    if (ownerId && theatreId) {
      console.log(
        "Processing specific theatre message for theatreId:",
        theatreId,
      );

      // Verify theatre exists and get owner
      const theatre = await Theatre.findById(theatreId);
      console.log("Found theatre:", theatre);

      if (!theatre) {
        console.log("Error: Theatre not found");
        return res.status(404).json({ msg: "Theatre not found" });
      }

      console.log("Theatre owner:", theatre.owner);

      // Create message for specific theatre owner
      const messageData = {
        from: req.user._id,
        to: theatre.owner,
        theatre: theatre._id,
        subject: subject || "Admin Notification",
        message,
        messageType: messageType || "info",
        priority: priority || "medium",
      };

      console.log("Creating AdminMessage with data:", messageData);

      const newMessage = await AdminMessage.create(messageData);
      console.log("Created AdminMessage:", newMessage);

      await newMessage.populate("from", "name email");
      await newMessage.populate("to", "name email");
      await newMessage.populate("theatre", "name");

      console.log("Populated message:", newMessage);
      return res.status(201).json(newMessage);
    }

    // If no specific theatre, return error
    console.log("Error: Theatre ID is required");
    return res.status(400).json({ msg: "Theatre ID is required" });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Add new movie
const addMovie = async (req, res) => {
  try {
    console.log("addMovie called");
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);
    console.log("Movie model:", Movie);

    const {
      title,
      description,
      duration,
      genre,
      releaseDate,
      language,
      trailerUrl,
      rating,
    } = req.body;

    console.log("Extracted fields:", {
      title,
      description,
      duration,
      genre,
      releaseDate,
      language,
      trailerUrl,
      rating,
    });

    // Validate required fields
    if (
      !title ||
      !description ||
      !duration ||
      !genre ||
      !releaseDate ||
      !language ||
      !rating
    ) {
      console.log("Validation failed - missing required fields");
      return res
        .status(400)
        .json({ msg: "All required fields must be provided" });
    }

    // Create new movie
    const movieData = {
      title,
      description,
      duration: parseInt(duration),
      genre,
      release_date: new Date(releaseDate),
      language,
      trailer_url: trailerUrl || "",
      rating,
      poster_url: req.file ? req.file.path : null,
      createdAt: new Date(),
    };

    console.log("Movie data to save:", movieData);

    // Test if we can create a movie instance
    const testMovie = new Movie(movieData);
    console.log("Movie instance created:", testMovie);

    const newMovie = await testMovie.save();
    console.log("Movie saved successfully:", newMovie);

    res.status(201).json({
      msg: "Movie added successfully",
      movie: newMovie,
    });
  } catch (error) {
    console.error("Add movie error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
  getUsers,
  getMovies,
  sendMessageToOwner,
  sendMessageToAllOwners,
  getAllMessages,
  getMessagesToOwner,
  getRankingsToday,
  getGraphsMonthly,
  testAdmin,
  testAdminMessage,
  sendMessage,
  addMovie,
};
