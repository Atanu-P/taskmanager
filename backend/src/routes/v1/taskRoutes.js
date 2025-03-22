const router = require("express").Router();
const auth = require("../../middlewares/auth");
const { test, createTask, getAllTasks, updateTask, deleteTask, updateTaskStatus } = require("../../controllers/task.controller");
// const Task = require("../../models/task");
// const ApiError = require("../../utils/ApiError");
// const ApiResponse = require("../../utils/ApiResponse");

// Test route
router.get("/", test);

// Route for creating a new task
router.post("/create", auth, createTask);

// Route for getting all tasks of a specific user
router.get("/all", auth, getAllTasks);

// Route for updating a task by task ID for a specific user
router.put("/update/:taskId", auth, updateTask);

// Route for deleting a task by task ID for a specific user
router.delete("/delete/:taskId", auth, deleteTask);

// Route for changing the status of a specific task
router.patch("/update-status/:taskId", auth, updateTaskStatus);

module.exports = router;
