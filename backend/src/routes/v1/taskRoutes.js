const router = require("express").Router();
const Task = require("../../models/task");
const auth = require("../../middlewares/auth");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

router.get("/", (req, res) => {
  res.send("Task Route");
  console.log("/Task Route !");
});

// Route for creating a new task
router.post("/create", auth, async (req, res, next) => {
  try {
    const { title, description, status, dueDate, priority, tags } = req.body;
    const userId = req.user._id; // Get the userId from the auth middleware

    if (!title || title.trim() === "") {
      throw new ApiError(400, "Task title is required");
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      status: "pending",
      dueDate,
      priority,
      tags,
      user: userId, // Assign the userId to the task
    });

    // Save the task to the database
    await newTask.save();

    const createdTask = await Task.findById(newTask._id);
    if (!createdTask) {
      throw new ApiError(500, "Something went wrong while creating the task");
    }

    res
      .status(201)
      .json(new ApiResponse(201, createdTask, "Task created successfully"));
  } catch (error) {
    next(error);
  }
});

// Route for getting all tasks of a specific user
router.get("/all", auth, async (req, res, next) => {
  try {
    // Get the userId from the auth middleware
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find all tasks for the authenticated user
    const tasks = await Task.find({ user: userId })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .skip(skip)
      .limit(limit);

    res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
  } catch (error) {
    next(error);
  }
});

// Route for updating a task by task ID for a specific user
router.put("/update/:taskId", auth, async (req, res, next) => {
  try {
    // Get the userId from the auth middleware
    const userId = req.user._id;
    const { taskId } = req.params;
    const { title, description, status, dueDate, priority } = req.body;

    console.log({ userId, taskId });

    // Find the task by ID and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      throw new ApiError(404, "Task not found or not authorized");
    }

    // Update the task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;

    // Save the updated task to the database
    await task.save();

    res
      .status(200)
      .json(new ApiResponse(200, task, "Task updated successfully"));
  } catch (error) {
    next(error);
  }
});

// Route for deleting a task by task ID for a specific user
router.delete("/delete/:taskId", auth, async (req, res, next) => {
  try {
    // Get the userId from the auth middleware
    const userId = req.user._id;
    const { taskId } = req.params;

    // Find the task by ID and ensure it belongs to the authenticated user
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!task) {
      throw new ApiError(404, "Task not found or not authorized");
    }

    res
      .status(200)
      .json(new ApiResponse(200, task, "Task deleted successfully"));
  } catch (error) {
    next(error);
  }
});
module.exports = router;
