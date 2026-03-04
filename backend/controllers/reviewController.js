 
const Review = require("../models/Review");

exports.getMyReviews = async (req,res)=>{
  const reviews = await Review.find({ user:req.user._id })
    .populate("movie");

  res.json(reviews);
};

exports.addReview = async (req, res) => {
  try {
    const { movie, rating, review_text, theatre } = req.body;
    
    // Basic validation
    if (!movie || !rating) {
      return res.status(400).json({ error: "Movie ID and rating are required" });
    }

    const newReview = new Review({
      user: req.user._id,
      movie,
      rating,
      review_text,
      theatre
    });

    await newReview.save();
    
    // Populate user details for returning to the frontend immediately
    await newReview.populate("user", "username");

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};