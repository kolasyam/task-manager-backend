const asyncHandler = require("express-async-handler");
const User = require("../Models/User");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  if (password < 6) {
    res.status(400);
    throw new Error("Password must be greater than 6");
  }
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: user.getSignedJwtToken(),
    });
    console.log(user);
  } else {
    res.status(400);
    throw new Error("Invalid User data");
  }
});
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
  });

  res.status(200).json({ message: "User logged out successfully" });
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  const token = user.getSignedJwtToken();
  // console.log("Generated Token:", token);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
  console.log(user._id, user.name, user.email, token);
});
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
    console.log(user.name);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
module.exports = { registerUser, logoutUser, loginUser, getUserProfile };
