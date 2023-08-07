const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized. Token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token." });
    }

    // Token is valid, attach user details to the request object
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
