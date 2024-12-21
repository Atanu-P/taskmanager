// Import the modules
const express = require("express");
const morgan = require("morgan");
const apiRoutes = require("./routes");

// Create an instance of an Express application
const app = express();

/* Middleware */

// parse JSON bodies
app.use(express.json());

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

// Export the app instance for use in other modules
module.exports = app;
