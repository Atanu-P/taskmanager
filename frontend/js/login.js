import config from "./config.js";

// Function to handle login
export default async function login(email, password) {
  try {
    const response = await fetch(`${config.apiBaseUrl}api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: "include", // Include cookies in the request
    });

    const data = await response.json();

    if (response.ok || response.status === 200) {
      console.log("Login successful:", data);
      // Redirect to another page or update the UI as needed
      window.location.href = "task.html";
    } else if (
      response.status === 400 &&
      data.message === "User does not exist"
    ) {
      console.error("Login failed:", data.message);
      // Display an alert with the error message
      alert("User does not exist");
    } else if (
      response.status === 401 &&
      data.message === "Invalid user credentials"
    ) {
      console.error("Login failed:", data.message);
      // Display an alert with the error message
      alert("Password is incorrect");
    } else {
      console.log("Login failed:", data);
      console.error("Login failed:", data.message);
      // Display an error message to the user
      alert("Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    // Display an error message to the user
  }
}
