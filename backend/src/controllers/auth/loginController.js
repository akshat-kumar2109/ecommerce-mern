import JWT from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

import Users from "../../models/userModel.js";
import { comparePassword, hashPassword } from "../../helpers/authHelpers.js";

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  // check if email and password is provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Please provide email and password",
    });
  }

  try {
    const user = await Users.findOne({ email });

    // check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User is not registered.",
      });
    }

    // check if provided password is correct or not
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = JWT.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status().json({
      success: false,
      error: "Login failed",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: "Please provide email and password",
    });
  }

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // create token
    const token = crypto.randomBytes(20).toString("hex");
    console.log(token);
    user.resetPasswordToken = token;
    // Token expires in 1 hour
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    // json password reset email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_SPECIFIC_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      // TODO: THIS LINK SHOULD BE CHANGED TO FRONTEND ENDPOINT, WHICH WILL
      // SEND THE REQUEST TO HERE MENTIONED LINK
      text: `Your link to reset the password is - http://localhost:${process.env.PORT}/forgot-password/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          success: false,
          error: "Error jsoning email",
        });
      }

      res.status(200).json({
        success: true,
        message: "Password reset email sent",
      });
    });
  } catch (error) {
    console.log(error);
    res.status().send({
      success: false,
      error: "Password reset email generation failed",
      error,
    });
  }
};

export const resetPasswordHandler = async (req, res) => {
  const user = await Users.findOne({
    resetPasswordToken: req.params.token,
    // checks if the resetPasswordExpires is greater than Date.now() or not
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: "Invalid or expired token",
    });
  }

  if (!req.body.password) {
    return res.status(400).json({
      success: false,
      error: "Password is not provided",
    });
  }

  // Update the user's password and clear the reset token
  const hashedPassword = await hashPassword(req.body.password);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
};
