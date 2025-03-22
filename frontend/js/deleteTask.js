import config from "./config.js";

// Delete task

export async function deleteTask(taskId) {
  try {
    const response = await fetch(`${config.apiBaseUrl}api/v1/tasks/delete/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const responseData = await response.json();

    if (response.ok || response.status === 200) {
      console.log("Task deleted successfully: ", responseData);
      // Remove task from the list
      // const task = document.querySelector(`li[id="${taskId}"]`);
      // // console.log(task)
      // task.remove();

      return responseData.data;
    } else {
      console.error("Failed to delete task: ", responseData);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
