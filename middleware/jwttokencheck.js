const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Unauthorized. Token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];
  console.log(token)
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token." });
    }

    // Token is valid, attach user details to the request object
    req.user = decoded.userId;
    console.log(req.user)
    next();
  });
};

module.exports = verifyToken;
