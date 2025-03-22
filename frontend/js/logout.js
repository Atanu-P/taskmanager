import config from "./config.js";

// Function to handle logout
export default async function logout() {
  if (confirm("Are you sure you want to logout?")) {
    try {
      sessionStorage.removeItem("loggedIn");
      const response = await fetch(`${config.apiBaseUrl}api/v1/users/logout`, {
        method: "POST",
        credentials: "include", // Include cookies in the request
      });

      const data = await response.json();

      if (response.ok || response.status === 200) {
        console.log("Logout successful:", data);

        // Redirect to login page
        window.location.href = "index.html";
      } else {
        console.error("Failed to logout:", data);
        // Display an error message to the user
      }
    } catch (error) {
      console.error("Error:", error);
      // Display an error message to the user
    }
    // window.location.href = "index.html";
  }
}
