const express = require("express");

const { validationResult } = require("express-validator");

const protect = require("../middleware/authMiddleware");

const upload = require("../utils/multer");

const {
  getTasks,
  getTaskStats,
  createTask,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const {
  createTaskValidator,
  updateTaskValidator,
  statusValidator,
} = require("../validators/taskValidator");

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

router.use(protect);

router.get("/stats", getTaskStats);

router.get("/", getTasks);

router.post(
  "/",
  upload.single("image"),
  createTaskValidator,
  handleValidation,
  createTask
);

router.get("/:id", getTask);

router.put(
  "/:id",
  updateTaskValidator,
  handleValidation,
  updateTask
);

router.patch(
  "/:id/status",
  statusValidator,
  handleValidation,
  updateTaskStatus
);

router.delete("/:id", deleteTask);

module.exports = router;
