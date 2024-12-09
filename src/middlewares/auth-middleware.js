const jwt = require("jsonwebtoken");
const db = require("../../db");

exports.protect = async (req, res, next) => {
  const token = req.cookies.auth_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, "saurav123");
      req.user = await db("users")
        .where({ id: decoded.id })
        .select("id", "email")
        .first();
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};
