const mongoose = require("mongoose");
const Task = require("../models/Task");
const {
  uploadImage,
  deleteImage,
} = require("../utils/uploadImage");

const getTasks = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 50);
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const filter = {
      user: req.user.userId,
    };

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const totalTasks = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const hasMore = skip + tasks.length < totalTasks;

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          page,
          limit,
          totalTasks,
          hasMore,
        },
      },
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching tasks",
    });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [total, pending, inProgress, completed] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: "pending" }),
      Task.countDocuments({ user: userId, status: "in-progress" }),
      Task.countDocuments({ user: userId, status: "completed" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        completed,
      },
    });
  } catch (error) {
    console.error("Get task stats error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching task statistics",
    });
  }
};

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
    } = req.body;

    let image = "";
    let imageId = "";

    if (req.file) {
      const result = await uploadImage(req.file.path);
      image = result.secure_url;
      imageId = result.public_id;
    }

    const task = await Task.create({
      user: req.user.userId,
      title,
      description,
      status,
      priority,
      dueDate,
      image,
      imageId,
    });

    await task.populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating task",
    });
  }
};

const getTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId,
    }).populate("user", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        task,
      },
    });
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching task",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating task",
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        status: req.body.status,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    console.error("Update task status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating task status",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.imageId) {
      await deleteImage(task.imageId);
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task and task image deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting task",
    });
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  createTask,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};

