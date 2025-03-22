const router = require("express").Router();
const auth = require("../../middlewares/auth");
const { test, registerUser, loginUser, logoutUser, refreshAccessToken, checkAuth } = require("../../controllers/user.contoller");
// const User = require("../../models/user");
// const ApiError = require("../../utils/ApiError");
// const ApiResponse = require("../../utils/ApiResponse");
// const jwt = require("jsonwebtoken");

// Test route
router.get("/", test);

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route for user logout
router.post("/logout", auth, logoutUser);

// Route for refreshing the access token
router.post("/refresh-token", refreshAccessToken);

// Authentication check endpoint
router.get("/check-auth", auth, checkAuth);

module.exports = router;
