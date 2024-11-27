const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/constants");

function authenticateToken(req, res, next) {
  const token =
    (req.headers.authorization && req.headers.authorization.split(" ")[1]) ||
    req.cookies.token;

  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = req.user || user;
    next();
  });
}

module.exports = authenticateToken;
