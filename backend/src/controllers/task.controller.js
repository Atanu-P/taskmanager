const Task = require("../models/task");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Test controller
exports.test = (req, res) => {
  res.send("Task Route");
  console.log("/Task Route !");
};

// Create a new task of specific user controller
exports.createTask = async (req, res, next) => {
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

    res.status(201).json(new ApiResponse(201, createdTask, "Task created successfully"));
  } catch (error) {
    next(error);
  }
};

// Get all tasks of specific user controller
exports.getAllTasks = async (req, res, next) => {
  try {
    // Get the userId from the auth middleware
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = req.query.filter || "all";
    const sort = req.query.sort || "date_new";

    /* query based on the filter */
    let query = { user: userId }; //default query
    if (filter !== "all") {
      query.status = filter; // query with task filter
    }

    /* task sorting order */
    let sortOrder = {};
    if (sort === "date_new") {
      sortOrder = { createdAt: -1 }; // Newest first
    } else if (sort === "date_old") {
      sortOrder = { createdAt: 1 }; // Oldest first
    } else if (sort === "priority") {
      sortOrder = { priority: 1 }; // Sort by priority (1 to 3) high to low
    }

    // Find all tasks for the authenticated user
    const tasks = await Task.find(query)
      .sort(sortOrder) // Sort by creation date in descending order
      .skip(skip)
      .limit(limit);

    res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

// Update a task by ID controller
exports.updateTask = async (req, res, next) => {
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

    res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
  } catch (error) {
    next(error);
  }
};

// Delete a task by ID controller
exports.deleteTask = async (req, res, next) => {
  try {
    // Get the userId from the auth middleware
    const userId = req.user._id;
    const { taskId } = req.params;

    // Find the task by ID and ensure it belongs to the authenticated user
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!task) {
      throw new ApiError(404, "Task not found or not authorized");
    }

    res.status(200).json(new ApiResponse(200, task, "Task deleted successfully"));
  } catch (error) {
    next(error);
  }
};

// Update task-status by ID controller
exports.updateTaskStatus = async (req, res, next) => {
  try {
    // Get the userId from the auth middleware
    const userId = req.user._id;
    const { taskId } = req.params;
    const { status } = req.body;

    console.log({ userId, taskId, status });
    // Find the task by ID and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      throw new ApiError(404, "Task not found or not authorized");
    }

    // Check if the task status is already the same as the new status
    if (task.status == status) {
      throw new ApiError(400, "Task status is already " + status);
    }

    // Update the task status
    task.status = status;

    // Save the updated task to the database
    await task.save();

    res.status(200).json(new ApiResponse(200, task, "Task status updated successfully"));
  } catch (error) {
    next(error);
  }
};
