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
    console.log("Auth middleware - Token:", token ? "Present" : "Missing");
    if (!token) return res.status(401).json({ msg: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth middleware - Decoded:", decoded);

    // decoded.id must exist
    if (!decoded.id) return res.status(401).json({ msg: "Token invalid" });

    const user = await User.findById(decoded.id);
    console.log("Auth middleware - User found:", user ? "Yes" : "No");
    console.log("Auth middleware - User role:", user?.role);
    if (!user) return res.status(401).json({ msg: "User not found" });

    req.user = user; // <-- now req.user._id exists
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
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
