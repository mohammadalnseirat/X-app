import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { handleErrors } from "../utils/error.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token;
    if (!token) {
      return next(handleErrors(401, "Unauthorized: No Token Provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return next(
        handleErrors(401, "Unauthorized: Invalid Token, Please Login Again!")
      );
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(handleErrors(404, "User Not Found!"));
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error in protectRoute middleware", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
