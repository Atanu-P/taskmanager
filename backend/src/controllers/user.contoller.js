const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const jwt = require("jsonwebtoken");

// Function to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (id) => {
  try {
    const user = await User.findById(id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
};

// Test controller
exports.test = (req, res) => {
  res.send("User Route");
  console.log("/User Route!");
};

// Register-user controller
exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if ([email, username, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
    });

    // Save the user to the database
    await newUser.save();

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newUser._id);

    return res
      .status(201)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 90 * 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 90 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          201,
          {
            user: createdUser,
            accessToken,
            refreshToken,
          },
          "User registered successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

// Login-user controller
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });

    if (!email) {
      throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
      email: email?.toLowerCase() || null,
    });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 90 * 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 90 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged In Successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

// Logout-user controller
exports.logoutUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    next(error);
  }
};

// Refresh-access-token controller
exports.refreshAccessToken = async (req, res, next) => {
  try {
    // console.log(req.cookies.refreshToken || req.body.refreshToken);
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    // console.log(incomingRefreshToken);

    if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
      })
      .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
  } catch (error) {
    next(error);
  }
};

// Check if user is authenticated controller
exports.checkAuth = (req, res, next) => {
  try {
    // console.log(req.user);
    return res.status(200).json(new ApiResponse(200, { user: req.user }, "User is authenticated"));
  } catch (error) {
    next(error);
  }
};
