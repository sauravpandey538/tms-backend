const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/me", authController.me);
// router.get('/protected', protect, (req, res) => {
//   res.json({ message: `Welcome ${req.user.username}` });
// });

module.exports = router;
