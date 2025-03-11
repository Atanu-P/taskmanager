import config from "./config.js";

// Function to update-task-status

export async function updateTaskStatus(taskId, status) {
  try {
    const response = await fetch(`${config.apiBaseUrl}api/v1/tasks/update-status/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status }),
      credentials: "include", // Include cookies in the request
    });

    const responseData = await response.json();

    if (response.ok || response.status === 200) {
      console.log("Task-status updated successfully:", responseData);
    } else {
      console.error("Failed to update-task status:", responseData);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
