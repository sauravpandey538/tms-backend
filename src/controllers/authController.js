const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../db");

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    await db("users").insert({ email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await db("users").where({ email }).first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a token
    const token = jwt.sign({ id: user.id }, "saurav123", {
      expiresIn: "6h",
    });
    console.log(token);
    res.cookie("auth_token", token, {
      httpOnly: false, // Helps prevent XSS attacknps
      path: "/",
      // secure: false, // Allows the cookie to be set over HTTP (not only HTTPS)
      // maxAge: 3600000, // 1 hour
      // sameSite: "None", // Prevents sending cookies across different sites
    });
    return res.json({ message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Login failed", message: error.message });
  }
};

const logout = (req, res) => {
  // Handle token invalidation (if using JWT, manage this on the client side or use a token blacklist)
  res.json({ message: "Logout successful" });
};

const me = async (req, res) => {
  const cookie = req.cookies.auth_token;
  if (!cookie) {
    return res.status(404).json({ message: "no token was found" });
  }

  try {
    // Replace 'your_secret_key' with your actual secret key used during token generation
    const decoded = jwt.verify(cookie, "saurav123");
    const id = decoded.id;
    const user = await db("users").where("id", id).first("email");

    const completedWithIn1Day = await db("tasks")
      .select("id")
      .where("author_id", id)
      .where("dueDate", ">", db.raw("current_date"))
      .where("dueDate", "<=", db.raw("current_date + INTERVAL '1 day'"))
      .andWhere("is_noticed", false);

    // completedWithIn1Day = ["1","3"]
    const taskIds = completedWithIn1Day.map((task) => task.id.toString());

    return res.status(200).json({
      message: "Token is valid",
      user: decoded,
      email: user.email,
      taskIds,
    });
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};
module.exports = {
  login,
  logout,
  register,
  me,
};
