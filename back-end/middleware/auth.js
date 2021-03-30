/* eslint-disable func-names */
const jwt = require("jsonwebtoken");
const config = require("config");

// Verify token middleware
// eslint-disable-next-line consistent-return
module.exports = function(req, res, next) {
  // Retrieve token
  const token = req.header("x-auth-token");

  // If no token
  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }

  // Verify token
  try {
    const decode = jwt.verify(token, config.get("jwtSecret"));
    req.user = decode.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
