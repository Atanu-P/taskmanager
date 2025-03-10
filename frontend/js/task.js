import config from "./config.js";

let currentPage = 1;
const limit = 10;
let loading = false;

let updateFormDefaultValues = {};
let taskId;

// Get the task form modal
const taskFormModal = new bootstrap.Modal(document.getElementById("taskFormModal"));
const updateTaskFormModal = new bootstrap.Modal(document.getElementById("updateTaskFormModal"));

// Function to create a task
async function createTask(task) {
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
      // Redirect or update the UI as needed
      addTaskToList(responseData.data, true);

      // Hide the task form modal
      taskFormModal.hide();
    } else {
      // Display an error message to the user
      console.error("Failed to create task:", responseData);
    }
  } catch (error) {
    // Display an error message to the user
    console.error("Error:", error);
  }
}

// Function to update-task-status
async function updateTaskStatus(taskId, status) {
  try {
    const response = await fetch(`${config.apiBaseUrl}api/v1/tasks/update-status/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
      credentials: "include", // Include cookies in the request
    });

    const data = await response.json();

    if (response.ok || response.status === 200) {
      console.log("Task-status updated successfully:", data);
    } else {
      console.error("Failed to update-task status:", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to update a task <- currently working
async function updateTask(taskId, task) {
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
      const taskItem = document.querySelector(`li[id="${taskId}"]`);
      taskItem.querySelector(".task-info strong").textContent = task.title;
      taskItem.querySelector(".task-info .badge").textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
      taskItem.querySelector(".task-info .badge").className = `badge bg-${
        task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "secondary"
      } rounded-pill ms-2`;
      taskItem.querySelector(".due-date").textContent = `Due: ${task.dueDate}`;
      taskItem.querySelector(".created-date").textContent = `Created: ${new Date(task.createdAt).toLocaleDateString()}`;

      // Hide the update task form modal
      updateTaskFormModal.hide();
    } else {
      console.error("Failed to update task:", responseData);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to delete a task
async function deleteTask(taskId) {
  try {
    const response = await fetch(`${config.apiBaseUrl}api/v1/tasks/delete/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const responseData = await response.json();

    if (response.ok || response.status === 200) {
      console.log("Task deleted successfully: ", responseData);
      // Remove task from the list
      const task = document.querySelector(`li[id="${taskId}"]`);
      // console.log(task)
      task.remove();
    } else {
      console.error("Failed to delete task: ", responseData);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to add a task inside unordered list
function addTaskToList(task, prepend = false) {
  const taskList = document.getElementById("taskList");
  const taskItem = document.createElement("li");
  // taskItem.textContent = `${task.title} - ${task.description} - ${task.dueDate} - ${task.priority} - ${task.tags.join(', ')}`;
  taskItem.classList.add("list-group-item", "task-item");
  taskItem.setAttribute("id", task._id);
  taskItem.innerHTML = `
        <input type="checkbox" data-task-id="${task._id}" 
        ${task.status === "completed" ? "checked" : ""}>

        <div class="task-info 
        ${task.status === "completed" ? "completed-task" : ""}">
            <strong>${task.title}</strong>
            <span class="badge 
            bg-${task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "secondary"} rounded-pill ms-2">
             ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
        </div>

        <div class="task-dates">
            <span class="due-date">Due: ${task.dueDate}</span>
            <span class="created-date">
                Created: ${new Date(task.createdAt).toLocaleDateString()}
            </span>
        </div>

        <button class="btn btn-sm btn-danger btn-delete">Delete</button> `;
  if (prepend) {
    taskList.prepend(taskItem);
  } else {
    taskList.appendChild(taskItem);
  }

  // Add event listener to the checkbox
  const checkbox = taskItem.querySelector('input[type="checkbox"]');
  checkbox.addEventListener("change", async (e) => {
    const taskId = e.target.getAttribute("data-task-id");
    const status = e.target.checked ? "completed" : "pending";
    await updateTaskStatus(taskId, status);

    // Toggle the completed-task class
    const taskInfo = taskItem.querySelector(".task-info");
    if (status === "completed") {
      taskInfo.classList.add("completed-task");
    } else {
      taskInfo.classList.remove("completed-task");
    }
  });

  //  Add event listener to the delete button
  const deleteButton = taskItem.querySelector(".btn-delete");
  deleteButton.addEventListener("click", async (e) => {
    console.log(task._id);
    if (confirm("Are you sure you want to delete this task ?")) {
      await deleteTask(task._id);
    }
  });

  // Add event listener to task item for opening update-task form modal
  taskItem.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
      const updateTitle = document.getElementById("updateTitle");
      const updateDescription = document.getElementById("updateDescription");
      const updateDueDate = document.getElementById("updateDueDate");
      const updatePriority = document.getElementById("updatePriority");
      const updateTags = document.getElementById("updateTags");
      const updateTaskButton = document.getElementById("updateTaskButton");

      console.log("click", task);
      // Set the default values
      updateTitle.value = task.title;
      updateDescription.value = task.description;
      updateDueDate.value = task.dueDate.split("T")[0];
      updatePriority.value = task.priority;
      updateTags.value = task.tags.join(", ");

      updateFormDefaultValues = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.split("T")[0],
        priority: task.priority,
        tags: task.tags.join(", "),
      };

      taskId = task._id;

      updateTaskFormModal.show();
      console.log([task._id, task.title, task.description, task.dueDate, task.priority, task.tags]);

      // task data shown as default value in update form
    }
  });
}

// Function to fetch tasks with pagination
async function fetchTasks(page, limit) {
  if (loading) return;
  loading = true;
  try {
    const response = await fetch(`${config.apiBaseUrl}api/v1/tasks/all?page=${page}&limit=${limit}`, {
      method: "GET",
      credentials: "include", // Include cookies in the request
    });

    const responseData = await response.json();

    if (response.ok || response.status === 200) {
      console.log("Tasks retrieved successfully:", responseData);
      responseData.data.forEach((task) => addTaskToList(task));
      currentPage++;
    } else {
      console.error("Failed to retrieve tasks:", responseData);
    }
  } catch (error) {
    console.error("Error:", error);
  }
  loading = false;
}

// Infinite scrolling for tasks
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400 && !loading) {
    fetchTasks(currentPage, limit);
  }
});

// Initial fetch of tasks
fetchTasks(currentPage, limit);

// Check if the task form exists
if (document.getElementById("taskForm")) {
  const taskForm = document.getElementById("taskForm");
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const dueDateInput = document.getElementById("dueDate");
  const priorityInput = document.getElementById("priority");
  const tagsInput = document.getElementById("tags");

  // Set the min attribute of the dueDate input to today's date
  const today = new Date().toISOString().split("T")[0];
  dueDateInput.setAttribute("min", today);

  // Add submit event listener to the form
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Ensure the input fields exist before accessing their values
    if (titleInput) {
      const title = titleInput.value;
      const description = descriptionInput.value;
      const dueDate = dueDateInput.value;
      const priority = priorityInput.value;
      const tags = tagsInput.value.split(",").map((tag) => tag.trim());

      // Create task object
      const task = {
        title,
        description,
        status: "",
        dueDate,
        priority,
        tags,
      };

      console.log(task);

      createTask(task);

      taskForm.reset();
    } else {
      console.error("Title field is missing.");
      alert("Title field is missing.");
    }
  });
}

if (document.getElementById("updateTaskFormModal")) {
  const updateTitle = document.getElementById("updateTitle");
  const updateDescription = document.getElementById("updateDescription");
  const updateDueDate = document.getElementById("updateDueDate");
  const updatePriority = document.getElementById("updatePriority");
  const updateTags = document.getElementById("updateTags");
  const updateTaskButton = document.getElementById("updateTaskButton");

  // Set the min attribute of the dueDate input to today's date
  const today = new Date().toISOString().split("T")[0];
  updateDueDate.setAttribute("min", today);

  // Add submit event listener to the update task form
  document.getElementById("updateTaskForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (updateTitle) {
      const updatedTask = {
        title: updateTitle.value,
        description: updateDescription.value,
        dueDate: updateDueDate.value,
        priority: updatePriority.value,
        tags: updateTags.value.split(",").map((tag) => tag.trim()),
      };
      console.log("newvalue", updatedTask);
      console.log("oldvalue", updateFormDefaultValues);
      console.log(e);

      if (
        updatedTask.title == updateFormDefaultValues.title &&
        updatedTask.description == updateFormDefaultValues.description &&
        updatedTask.dueDate == updateFormDefaultValues.dueDate &&
        updatedTask.priority == updateFormDefaultValues.priority &&
        updatedTask.tags.join(", ") == updateFormDefaultValues.tags
      ) {
        alert("No changes made to the task.");
      } else {
        await updateTask(taskId, updatedTask);
        updateTaskFormModal.hide();
        // window.location.reload();
      }
    } else {
      console.error("Title field is missing.");
      alert("Title field is missing.");
    }

    // await updateTask(task._id, updatedTask);
  });
}
