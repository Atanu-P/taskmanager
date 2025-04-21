const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: Number,
      enum: [1, 2, 3], // 1: High, 2: Medium, 3: Low
      default: 3,
    },
    tags: {
      type: [String], // Array of strings for tags
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
