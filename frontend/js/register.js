import config from "./config.js";

// Function to handle user registration
export default async function register(username, email, password) {
  try {
    const response = await fetch(`${config.apiBaseUrl}api/v1/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
      credentials: "include", // Include cookies in the request
    });

    const data = await response.json();

    if (
      response.ok ||
      response.status === 200 ||
      response.status === 201 ||
      response.message === "User registered successfully"
    ) {
      console.log("Registration successful:", data);
      // Redirect to another page or update the UI as needed
      window.location.href = "task.html";
    } else if (response.status === 400 && data.message === "User already exists") {
      console.error("Registration failed:", data.message);
      // Display an alert with the error message
      alert("User with email already exists");
    } else if (response.status === 400 && data.message === "All fields are required") {
      console.error("Registration failed:", data.message);
      // Display an alert with the error message
      // alert('All fields are required');
    } else {
      console.log("Registration failed:", data);
      console.error("Registratiion failed:", data.message);
      // Display an alert message to the user
      alert("User registration failed. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    // Display unknown error
  }
}
