const jwt = require("jsonwebtoken");
const User = require("../models/User");

// const protect = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "Not authorized" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ msg: "Token invalid" });
//   }
// };
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded.id must exist
    if (!decoded.id) return res.status(401).json({ msg: "Token invalid" });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: "User not found" });

    req.user = user; // <-- now req.user._id exists
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token invalid" });
  }
};

const admin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ msg: "Admin access only" });
  }
  next();
};

module.exports = { protect, admin };
