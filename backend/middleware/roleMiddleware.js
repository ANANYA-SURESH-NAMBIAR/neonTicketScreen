const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("Role middleware - User role:", req.user?.role);
    console.log("Role middleware - Required roles:", roles);
    console.log(
      "Role middleware - Access granted:",
      roles.includes(req.user?.role),
    );

    if (!roles.includes(req.user?.role))
      return res.status(403).json({ msg: "Forbidden" });
    next();
  };
};

module.exports = { authorize };
