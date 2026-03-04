 
const Theatre = require("../models/Theatre");
const mongoose = require("mongoose");

// Add a theatre
const addTheatre = async (req, res) => {
  try {
    const { name, address, city, theatre_type, rating } = req.body;

    const theatre = await Theatre.create({
      name,
      address,
      city,
      theatre_type,
      rating,
      owner: req.user._id, // link theatre to logged-in owner
    });

    res.status(201).json(theatre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get theatres of logged-in owner
// const getTheatres = async (req, res) => {
//   try {
//     // If the user is logged in as theatre owner, filter by owner
//     const ownerId = req.user ? req.user._id : null;

//     const theatres = ownerId
//       ? await Theatre.find({ owner: ownerId })
//       : await Theatre.find(); // fallback: return all theatres if no owner

//     res.status(200).json(theatres);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const getTheatres = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id); // now this is a proper ObjectId
    console.log("Owner ID:", req.user._id);
    const theatres = await Theatre.find({ owner: ownerId });
    console.log("Found theatres:", theatres);

    res.status(200).json(theatres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addTheatre, getTheatres };
