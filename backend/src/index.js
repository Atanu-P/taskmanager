const dotenv = require("dotenv");
// const connectDB = require('./db');
const app = require("./app");

// Load environment variables from .env file
dotenv.config();

// Connect to the database
// connectDB();

// Define the port number from environment variables or use 5000 as default
const PORT = process.env.PORT || 4000;

// Start the server and listen on the defined port
app.listen(PORT, () => console.log(`API Server is running on port ${PORT}`));
