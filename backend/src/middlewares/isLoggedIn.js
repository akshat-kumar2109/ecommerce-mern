import jwt from "jsonwebtoken";

const isLoggedIn = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: "Please provide the login token",
    });
  }

  token = token.substring(7);

  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.token = token
    res.locals.verify = verify
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      success: false,
      error: "You are not logged in",
    });
  }
};

export default isLoggedIn;
