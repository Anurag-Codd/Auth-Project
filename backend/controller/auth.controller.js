import bcryptjs from "bcryptjs";
import crypto from "crypto";

import {
  clearTempUser,
  generateToken,
  getTempUserByToken,
  storeTempUser,
} from "../utils/utils.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../nodemailer/emails.js";
import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({  message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    const verificationToken = crypto
      .randomBytes(3)
      .toString("hex")
      .slice(0, 6)
      .toUpperCase();

    await storeTempUser({
      username,
      email,
      password: hashedPassword,
      verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

    res
      .status(200)
      .json({
        message: "Verification email sent. Please check your inbox.",
      });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.body;
  try {
    const tempUser = await getTempUserByToken(token);
    if (!tempUser) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = new User({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      isVerified: true,
    });

    generateToken(res, user._id);

    await user.save();
    await clearTempUser(token);
    await sendWelcomeEmail(user.email, user.username);

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({  message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email)
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({  message: "Invalid credentials" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateToken(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: `fuck ${error.message}` });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("authAppToken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken =  crypto.randomBytes(3).toString("hex").slice(0, 6).toUpperCase();
    const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000;

    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcryptjs.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successfull" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};