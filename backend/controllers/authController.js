const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ msg: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed, role });

  res.json({ token: generateToken(user._id, user.role) });
};

const login = async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  res.json({ token: generateToken(user._id, user.role) });
};

const logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        msg: "If an account with this email exists, the password has been reset.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    console.log(`Password reset for email: ${email}`); // In production, send confirmation email

    res.json({
      msg: "Password reset successfully!",
      // For development, include user info (remove in production)
      user:
        process.env.NODE_ENV === "development"
          ? { email: user.email, role: user.role }
          : undefined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
};
