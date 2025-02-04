const router = require("express").Router();
const User = require("../../models/user");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const auth = require("../../middlewares/auth");

const generateAccessAndRefereshTokens = async (id) => {
  try {
    const user = await User.findById(id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

router.get("/", (req, res) => {
  res.send("User Route");
  console.log("/User Route!");
});

// Route for user registration
router.post("/register", async (req, res, next) => {
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

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      newUser._id
    );

    return res
      .status(201)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
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
});

// Route for user login
router.post("/login", async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    console.log(email);

    if (!username && !email) {
      throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
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
});

// Route for user logout
router.post("/logout", auth, async (req, res, next) => {
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
});

module.exports = router;
