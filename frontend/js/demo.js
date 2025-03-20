let currentPage = 1;
const limit = 10;
let loading = false;

let updateFormDefaultValues = {};
// array of demo tasks
let tasks = [
  {
    createdAt: "2025-03-20T10:26:55.051Z",
    description: "Fill university exam form, and pay exam fee to admin office in college before May",
    dueDate: "2025-04-05",
    priority: "high",
    status: "pending",
    tags: ["college", "study", "exam"],
    title: "Submit college Exam-Form",
    updatedAt: "2025-03-20T10:26:55.052Z",
    _id: "ox9a1mhtg",
  },
  {
    createdAt: "2025-03-20T10:26:55.051Z",
    description: "Submit the assignment to the respective teacher before April",
    dueDate: "2025-03-30",
    priority: "medium",
    status: "pending",
    tags: ["college", "study"],
    title: "Submit Assignment",
    updatedAt: "2025-03-20T10:26:55.052Z",
    _id: "ox9a1mhfd",
  },
  {
    createdAt: "2025-03-20T10:26:55.051Z",
    description: "Recharge your sim card on April 1st",
    dueDate: "2025-04-01",
    priority: "low",
    status: "pending",
    tags: ["personal"],
    title: "Recharge sim card",
    updatedAt: "2025-03-20T10:26:55.052Z",
    _id: "ox9a1mhtt",
  },
  {
    createdAt: "2025-03-20T10:26:55.051Z",
    description: "click on the checkbox to mark the task as completed",
    dueDate: "",
    priority: "low",
    status: "pending",
    tags: ["demo"],
    title: "👆 These are the demo tasks",
    updatedAt: "2025-03-20T10:26:55.052Z",
    _id: "ox9a1mhsr",
  },
];

function checkNoTasksMessage() {
  const noTasksMessage = document.getElementById("noTasksMessage");
  if (tasks.length === 0) {
    noTasksMessage.style.display = "block";
  } else {
    noTasksMessage.style.display = "none";
  }
}

// Get the task form modal
const taskFormModal = new bootstrap.Modal(document.getElementById("taskFormModal"));
const updateTaskFormModal = new bootstrap.Modal(document.getElementById("updateTaskFormModal"));
function formateDemoTask(task) {
  return {
    createdAt: task.createdAt || new Date().toISOString(),
    description: task.description || "",
    dueDate: task.dueDate || "",
    priority: task.priority || "medium",
    status: task.status || "pending",
    tags: task.tags || [""],
    title: task.title || "",
    updatedAt: task.updatedAt || new Date().toISOString(),
    _id: task._id || Math.random().toString(36).substr(2, 9),
  };
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
            <span class="due-date">Due: ${task.dueDate?.split("T")[0] || "no due"}</span>
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

  checkNoTasksMessage();

  // Add event listener to the checkbox
  const checkbox = taskItem.querySelector('input[type="checkbox"]');
  checkbox.addEventListener("change", async (e) => {
    const taskId = e.target.getAttribute("data-task-id");
    const status = e.target.checked ? "completed" : "pending";
    //   await updateTaskStatus(taskId, status);

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
  deleteButton.addEventListener("click", (e) => {
    console.log(task._id);
    if (confirm("Are you sure you want to delete this task ?")) {
      // remove task from tasks array
      const taskIndex = tasks.findIndex((t) => t._id === task._id);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
      }

      // Remove task from the list
      document.querySelector(`li[id="${task._id}"]`).remove();
      checkNoTasksMessage();
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

      const task = tasks.find((t) => t._id === taskItem.getAttribute("id"));

      console.log("click", task);
      // Set the default values
      updateTitle.value = task.title;
      updateDescription.value = task.description;
      updateDueDate.value = task.dueDate?.split("T")[0];
      updatePriority.value = task.priority;
      updateTags.value = task.tags.join(", ");

      updateFormDefaultValues = {
        _id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate?.split("T")[0],
        priority: task.priority,
        tags: task.tags.join(", "),
      };

      // taskId = task._id;

      updateTaskFormModal.show();
      console.log([task._id, task.title, task.description, task.dueDate, task.priority, task.tags]);

      // task data shown as default value in update form
    }
  });
}

tasks.forEach((task) => addTaskToList(task));

// Check if the task form exists
if (document.getElementById("taskForm")) {
  console.log("taskForm exists");
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
  taskForm.addEventListener("submit", async (e) => {
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

      const formatedTask = formateDemoTask(task);
      tasks.push(formatedTask);
      addTaskToList(formatedTask, true);

      taskFormModal.hide();
      taskForm.reset();
      checkNoTasksMessage();
      console.log(tasks);
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
  // const updateTaskButton = document.getElementById("updateTaskButton");

  // Set the min attribute of the dueDate input to today's date
  const today = new Date().toISOString().split("T")[0];
  updateDueDate.setAttribute("min", today);

  // Add submit event listener to the update task form
  document.getElementById("updateTaskForm").addEventListener("submit", (e) => {
    e.preventDefault();

    if (updateTitle) {
      const updatedTask = {
        _id: updateFormDefaultValues._id,
        title: updateTitle.value,
        description: updateDescription.value,
        dueDate: updateDueDate.value,
        priority: updatePriority.value,
        tags: updateTags.value.split(",").map((tag) => tag.trim()),
      };
      console.log("newvalue", updatedTask);
      console.log("oldvalue", updateFormDefaultValues);

      if (
        updatedTask.title == updateFormDefaultValues.title &&
        updatedTask.description == updateFormDefaultValues.description &&
        updatedTask.dueDate == updateFormDefaultValues.dueDate &&
        updatedTask.priority == updateFormDefaultValues.priority &&
        updatedTask.tags.join(", ") == updateFormDefaultValues.tags
      ) {
        alert("No changes made to the task.");
      } else {
        const data = formateDemoTask(updatedTask);
        console.log("data", data);

        // Update the task in the tasks array
        const taskIndex = tasks.findIndex((t) => t._id === data._id);
        if (taskIndex !== -1) {
          tasks[taskIndex] = data;
        }

        if (data) {
          const taskItem = document.querySelector(`li[id="${data._id}"]`);
          taskItem.querySelector(".task-info strong").textContent = data.title;
          taskItem.querySelector(".task-info .badge").textContent =
            data.priority.charAt(0).toUpperCase() + data.priority.slice(1);
          taskItem.querySelector(".task-info .badge").className = `badge bg-${
            data.priority === "high" ? "danger" : data.priority === "medium" ? "warning" : "secondary"
          } rounded-pill ms-2`;
          taskItem.querySelector(".due-date").textContent = `Due: ${data.dueDate}`;
          taskItem.querySelector(".created-date").textContent = `Created: ${new Date(data.createdAt).toLocaleDateString()}`;
        }

        // Hide the update task form modal
        updateTaskFormModal.hide();
        // updateTitle.value = "";
        // updateDescription.value = "";
        // updateDueDate.value = "";
        // updatePriority.value = "";
        // updateTags.value = "";
        // window.location.reload();
      }
    } else {
      console.error("Title field is missing.");
      alert("Title field is missing.");
    }

    // await updateTask(task._id, updatedTask);
  });
}

{
  createdAt: "2025-03-18T11:46:11.790Z";
  description: "";
  dueDate: "2025-03-19T00:00:00.000Z";
  priority: "medium";
  status: "pending";
  tags: [""];
  title: "task 46";
  updatedAt: "2025-03-18T11:46:11.790Z";
  _id: "67d95d037cd085dd1aeeb92e";
}
