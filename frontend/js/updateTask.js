import config from "./config.js";

// Function to update a task

export async function updateTask(taskId, task) {
  try {
    const response = await fetch(`${config.apiBaseUrl}api/v1/tasks/update/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
      credentials: "include", // Include cookies in the request
    });

    const responseData = await response.json();

    if (response.ok || response.status === 200) {
      console.log("Task updated successfully:", responseData);
      // Update the task in the list
      // const taskItem = document.querySelector(`li[id="${taskId}"]`);
      // taskItem.querySelector(".task-info strong").textContent = task.title;
      // taskItem.querySelector(".task-info .badge").textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
      // taskItem.querySelector(".task-info .badge").className = `badge bg-${
      //   task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "secondary"
      // } rounded-pill ms-2`;
      // taskItem.querySelector(".due-date").textContent = `Due: ${task.dueDate}`;
      // taskItem.querySelector(".created-date").textContent = `Created: ${new Date(task.createdAt).toLocaleDateString()}`;

      // // Hide the update task form modal
      // updateTaskFormModal.hide();
      return responseData.data;
    } else {
      console.error("Failed to update task:", responseData);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
