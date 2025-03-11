import config from "./config.js";

// Function to create a task

export async function createTask(task) {
  try {
    const response = await fetch(`${config.apiBaseUrl}api/v1/tasks/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
      credentials: "include", // Include cookies in the request
    });

    const responseData = await response.json();

    if (response.ok || response.status === 201 || response.message === "Task created successfully") {
      console.log("Task created successfully:", responseData);
      return responseData.data;

      // Redirect or update the UI as needed
      //   addTaskToList(responseData.data, true);

      // Hide the task form modal
      //   taskFormModal.hide();
    } else {
      // Display an error message to the user
      console.error("Failed to create task:", responseData);
      return false;
    }
  } catch (error) {
    // Display an error message to the user
    console.error("Error:", error);
  }
}
