const express = require("express");
const router = express.Router();
const {
  registerUser,
  logoutUser,
  loginUser,
  getUserProfile,
} = require("../Controllers/userController");
const { protect } = require("../Middleware/authMiddleware");
router.post("/register", registerUser);
router.get("/logout", logoutUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
module.exports = router;
