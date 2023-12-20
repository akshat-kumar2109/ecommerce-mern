import Users from "../../models/userModel.js";
import { hashPassword } from "../../helpers/authHelpers.js";

export const registerController = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // check if body has the required fields
  if (!name || !email || !password || !phone || !address) {
    // status code 400 means "No content"
    return res.status(400).json({
      success: false,
      error: "Required fields are missing",
    });
  }

  // validate phone number
  if (phone.length < 10 || phone.length > 10) {
    return res.status(400).json({
      success: false,
      error: "Please enter valid phone number",
    });
  }

  // validation for password length
  if (password.length < 8) {
    // status code 400 is for "bad request" - mainly for client side errors
    return res.status(400).json({
      success: false,
      error: "Password length should be atlease 8 characters",
    });
  }

  try {
    // check if user already exists or not
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      // 409 -> The request could not be completed due to a conflict with the current state of the resource.
      return res.status(409).json({
        success: false,
        error: "User is already registered",
      });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // create user
    const user = await Users.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status().json({
      success: false,
      error: "Registeration failed",
      error,
    });
  }
};
