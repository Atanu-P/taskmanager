// generates the UI for a task item in the task list.
export default function taskUI(task) {
  return `
        <input type="checkbox" data-task-id="${task._id}" 
        ${task.status === "completed" ? "checked" : ""}>

        <div class="task-info 
        ${task.status === "completed" ? "completed-task" : ""}">
            <p class="task-title">${task.title}</p>
            <span class="badge 
            bg-${task.priority == 1 ? "danger" : task.priority == 2 ? "warning" : "secondary"} rounded-pill ms-2">
             ${task.priority == 1 ? "High" : task.priority == 2 ? "Medium" : "Low"}
            </span>
        </div>

        <div class="task-dates">
            <span class="due-date" style="display: ${task.dueDate == null ? "none" : ""};">
              <i class="bi bi-bell-fill"></i> ${new Date(task.dueDate).toLocaleDateString()}
            </span>
            <span class="created-date">
              <i class="bi bi-calendar-week"></i> ${new Date(task.createdAt).toLocaleDateString()}
            </span>
        </div>

        <button class="btn btn-sm btn-danger btn-delete"><i class="bi bi-x-lg"></i></button> `;
}
