const crypto = require("crypto");
const fs = require("fs");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const { generateJWT } = require("../utils/generateToken");
const handleError = require("../utils/handleError");
const {
  uploadImage,
  deleteImage,
} = require("../utils/uploadImage");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/sendEmail");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verify: false,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    await sendVerificationEmail(user.email, verificationToken);

    const token = await generateJWT({
      userId: user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        verify: user.verify,
      },
    });
  } catch (error) {
    return handleError(res, error, "Registration failed");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.verify) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before signing in",
      });
    }

    const token = await generateJWT({
      userId: user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        verify: user.verify,
      },
    });
  } catch (error) {
    return handleError(res, error, "Login failed");
  }
};


const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return handleError(res, error, "Failed to get user");
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let emailChanged = false;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Another account already uses this email",
        });
      }

      user.email = email;
      user.verify = false;
      emailChanged = true;

      const verificationToken = crypto
        .randomBytes(32)
        .toString("hex");

      user.verificationToken = verificationToken;
      user.verificationTokenExpires =
        Date.now() + 24 * 60 * 60 * 1000;

      await sendVerificationEmail(
        user.email,
        verificationToken
      );
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select(
      "-password"
    );

    return res.status(200).json({
      success: true,
      message: emailChanged
        ? "Profile updated successfully. Please verify your new email."
        : "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return handleError(res, error, "Failed to update profile");
  }
};



const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.profileImageId) {
      await deleteImage(user.profileImageId);
    }

    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return handleError(res, error, "Failed to delete account");
  }
};

const uploadProfilePicture = async (req, res) => {
  let localFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    localFilePath = req.file.path;

    const user = await User.findById(req.user.userId);

    if (!user) {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await uploadImage(localFilePath);

    if (user.profileImageId) {
      await deleteImage(user.profileImageId);
    }

    user.profileImage = result.secure_url;
    user.profileImageId = result.public_id;

    await user.save();

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    const updatedUser = await User.findById(user._id).select(
      "-password"
    );

    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (
      localFilePath &&
      fs.existsSync(localFilePath)
    ) {
      fs.unlinkSync(localFilePath);
    }

    return handleError(
      res,
      error,
      "Profile picture upload failed"
    );
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    user.verify = true;
    user.verificationToken = "";
    user.verificationTokenExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Email verification failed"
    );
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    await sendResetPasswordEmail(
      user.email,
      resetToken
    );

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to send password reset email"
    );
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Password reset failed"
    );
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  deleteAccount,
  uploadProfilePicture,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

