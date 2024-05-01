const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

module.exports = isAuthenticated;
