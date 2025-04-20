// Import modules
const express = require("express");
const morgan = require("morgan");
const apiRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// instance of an Express application
const app = express();

/* Middleware */

app.use(
  cors({
    origin: "*", // frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

// parse JSON bodies
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

// parse URL-encoded bodies
/* `extended: true` option allows for rich objects and arrays 
    to be encoded into the URL-encoded format  */
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(morgan("dev"));

app.use(apiRoutes);

// simple route for the root URL testing
app.get("/helloworld", (req, res) => {
  res.status(200);
  res.json({
    statusCode: 200,
    message: "Hello, world!! This is a test API response",
    success: true,
  });
  // res.send("Hello, world!");
  console.log("/Hello, world!");
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../../frontend")));

// Serve index.html for all unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

/* Global Error Handler */
app.use((err, req, res, next) => {
  // Log the error stack trace for debugging
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Export the app instance for use in other modules
module.exports = app;
