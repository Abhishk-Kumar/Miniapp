const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authentication logic
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startswith("Bearer")) {
    return res.status(401).json({
      message: "No token provided",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decodetoken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodetoken;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "token invalid or might have been expired",
    });
  }
}

module.exports = authMiddleware;
