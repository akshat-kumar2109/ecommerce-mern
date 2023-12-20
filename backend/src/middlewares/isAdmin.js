import Users from "../models/userModel.js";

const isAdmin = async (req, res, next) => {
  const email = res.locals.verify.email;
  // Data passed through isLoggedIn middleware
  // console.log(res.locals.token, res.locals.verify);

  const user = await Users.findOne({ email });

  if (user.role === "user") {
    return res.status(403).json({
      success: false,
      error: "You are not an admin",
    });
  }

  next();
};

export default isAdmin;
