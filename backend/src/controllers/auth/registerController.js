import Users from "../../models/userModel.js";
import { hashPassword } from "../../helpers/authHelpers.js";

export const registerController = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // check if body has the required fields
  if (!name || !email || !password || !phone || !address) {
    // status code 400 means "No content"
    res.status(400).send({
      success: false,
      message: "Fields are missing",
    });
    return;
  }

  // validate phone number
  if (phone.length < 10 || phone.length > 10) {
    res.status(400).send({
      success: false,
      message: "Please enter valid phone number",
    });
    return;
  }

  // validation for password length
  if (password.length < 8) {
    // status code 400 is for "bad request" - mainly for client side errors
    res.status(400).send({
      success: false,
      message: "Password length should be atlease 8 characters",
    });
    return;
  }

  try {
    // check if user already exists or not
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      // 409 -> The request could not be completed due to a conflict with the current state of the resource.
      res.status(409).send({
        success: false,
        message: "User is already registered",
      });
      return;
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

    res.status(201).send({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status().send({
      success: false,
      message: "Registeration failed",
      error,
    });
  }
};

export default registerController;
