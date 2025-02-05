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
    const { title, description, status, dueDate, priority } = req.body;
    const userId = req.user._id; // Get the userId from the auth middleware

    if (!title || title.trim() === "") {
      throw new ApiError(400, "Task title is required");
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      status,
      dueDate,
      priority,
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

module.exports = router;
