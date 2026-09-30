const express = require("express");

const { validationResult } = require("express-validator");

const {
  register,
  login,
  getMe,
  updateProfile,
  deleteAccount,
  uploadProfilePicture,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const protect = require("../middleware/authMiddleware");

const upload = require("../utils/multer");

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

router.post(
  "/register",
  registerValidator,
  handleValidation,
  register
);

router.post(
  "/login",
  loginValidator,
  handleValidation,
  login
);

router.get(
  "/verify-email/:token",
  verifyEmail
);

router.get(
  "/me",
  protect,
  getMe
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.delete(
  "/account",
  protect,
  deleteAccount
);

router.post(
  "/profile-picture",
  protect,
  upload.single("profileImage"),
  uploadProfilePicture
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);

module.exports = router;
