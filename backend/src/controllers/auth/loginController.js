import JWT from "jsonwebtoken";

import Users from "../../models/userModel.js";
import { comparePassword } from "../../helpers/authHelpers.js";

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  // check if email and password is provided
  if (!email || !password) {
    res.status(400).send({
      success: false,
      message: "Please provide email and password",
    });
    return;
  }

  try {
    const user = await Users.findOne({ email });

    // check if user exists
    if (!user) {
      res.status(404).send({
        success: false,
        message: "User is not registered.",
      });
      return;
    }

    // check if provided password is correct or not
    const match = await comparePassword(password, user.password);
    if (!match) {
      res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status().send({
      success: false,
      message: "Login failed",
      error,
    });
  }
};

export default loginController;
