const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error == "TokenExpiredError: jwt expired") {
      next(new ApiError(401, "Token expired"));
    }
    next(error);
  }
};

module.exports = auth;
