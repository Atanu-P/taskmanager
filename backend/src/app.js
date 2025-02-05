// Import the modules
const express = require("express");
const morgan = require("morgan");
const apiRoutes = require("./routes");
const cookieParser = require("cookie-parser");

// Create an instance of an Express application
const app = express();

/* Middleware */

// parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// parse URL-encoded bodies
/* `extended: true` option allows for rich objects and arrays 
    to be encoded into the URL-encoded format  */
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Define a simple route for the root URL
app.get("/", (req, res) => {
  res.send("Hello, world!");
  console.log("/Hello, world!");
});
app.use(apiRoutes);

/* Global Error Handler */
app.use((err, req, res, next) => {
  // Log the error stack trace for debugging
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Export the app instance for use in other modules
module.exports = app;
