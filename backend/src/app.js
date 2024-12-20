// Import the modules
const express = require("express");

// Create an instance of an Express application
const app = express();

/* Middleware */

// parse JSON bodies
app.use(express.json());

// parse URL-encoded bodies
/* `extended: true` option allows for rich objects and arrays 
    to be encoded into the URL-encoded format  */
app.use(express.urlencoded({ extended: true }));

// Define a simple route for the root URL
app.get("/", (req, res) => {
  res.send("Hello, world!");
  console.log("/Hello, world!");
});

// Export the app instance for use in other modules
module.exports = app;
