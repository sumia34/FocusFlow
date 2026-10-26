import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: "",
      maxlength: 2000,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String,
      default: "General",
      maxlength: 100,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, createdAt: -1 });

const Task =
  mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;