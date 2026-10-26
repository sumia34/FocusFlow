
import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// GET /api/tasks — list the logged-in user's tasks
router.get("/tasks", async (req, res) => {
  try {
    const db = getDB();

    const tasks = await db
      .collection("tasks")
      .find({ userId: new ObjectId(req.user.userId) })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({ tasks });
  } catch (error) {
    console.error("Load tasks failed:", error.message);
    return res.status(500).json({ message: "Could not load tasks." });
  }
});

// POST /api/tasks — create a task
router.post("/tasks", async (req, res) => {
  try {
    const {
      title,
      description = "",
      priority = "medium",
      category = "General",
      dueDate = null,
      completed = false,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 200
    ) {
      return res.status(400).json({
        message: "Task title is required and must be under 200 characters.",
      });
    }

    if (
      typeof description !== "string" ||
      description.length > 2000
    ) {
      return res.status(400).json({
        message: "Description must be text under 2000 characters.",
      });
    }

    if (
      !["low", "medium", "high"].includes(priority)
    ) {
      return res.status(400).json({ message: "Invalid priority." });
    }

    if (typeof category !== "string" || category.length > 100) {
      return res.status(400).json({ message: "Invalid category." });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        message: "Completed must be true or false.",
      });
    }

    let parsedDueDate = null;

    if (dueDate !== null && dueDate !== "") {
      parsedDueDate = new Date(dueDate);

      if (Number.isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ message: "Invalid due date." });
      }
    }

    const task = {
      userId: new ObjectId(req.user.userId),
      title: title.trim(),
      description,
      priority,
      category: category.trim() || "General",
      dueDate: parsedDueDate,
      completed,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const db = getDB();
    const result = await db.collection("tasks").insertOne(task);

    return res.status(201).json({
      message: "Task created successfully.",
      task: { ...task, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Create task failed:", error.message);
    return res.status(500).json({ message: "Could not create task." });
  }
});

// PATCH /api/tasks/:id — update the logged-in user's task
router.patch("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const allowedFields = [
      "title",
      "description",
      "completed",
      "priority",
      "category",
      "dueDate",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid task fields were provided.",
      });
    }

    if ("title" in updates) {
      if (
        typeof updates.title !== "string" ||
        !updates.title.trim() ||
        updates.title.trim().length > 200
      ) {
        return res.status(400).json({ message: "Invalid task title." });
      }

      updates.title = updates.title.trim();
    }

    if (
      "description" in updates &&
      (typeof updates.description !== "string" ||
        updates.description.length > 2000)
    ) {
      return res.status(400).json({ message: "Invalid description." });
    }

    if (
      "priority" in updates &&
      !["low", "medium", "high"].includes(updates.priority)
    ) {
      return res.status(400).json({ message: "Invalid priority." });
    }

    if (
      "completed" in updates &&
      typeof updates.completed !== "boolean"
    ) {
      return res.status(400).json({ message: "Invalid completed value." });
    }

    if (
      "category" in updates &&
      (typeof updates.category !== "string" ||
        updates.category.length > 100)
    ) {
      return res.status(400).json({ message: "Invalid category." });
    }

    if ("category" in updates) {
      updates.category = updates.category.trim() || "General";
    }

    if ("dueDate" in updates) {
      if (updates.dueDate === null || updates.dueDate === "") {
        updates.dueDate = null;
      } else {
        const date = new Date(updates.dueDate);

        if (Number.isNaN(date.getTime())) {
          return res.status(400).json({ message: "Invalid due date." });
        }

        updates.dueDate = date;
      }
    }

    updates.updatedAt = new Date();

    const db = getDB();

    const task = await db.collection("tasks").findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(req.user.userId),
      },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.json({
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    console.error("Update task failed:", error.message);
    return res.status(500).json({ message: "Could not update task." });
  }
});

// DELETE /api/tasks/:id — delete only the logged-in user's task
router.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const db = getDB();

    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(req.user.userId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Delete task failed:", error.message);
    return res.status(500).json({ message: "Could not delete task." });
  }
});

export default router;
