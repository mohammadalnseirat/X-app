import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { handleErrors } from "../utils/error.js";
import { generateTokenAndSetCookies } from "../lib/generateToken.js";

// 1-Function To Sign Up:
export const signUp_post = async (req, res, next) => {
  try {
    const { username, fullName, email, password } = req.body;
    if (
      !username ||
      !fullName ||
      !email ||
      !password ||
      username === "" ||
      fullName === "" ||
      email === "" ||
      password === ""
    ) {
      return next(handleErrors(400, "Please Enter All Required Fields!"));
    }
    // check if the email correct:
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(handleErrors(400, "Please Enter A Valid Email!"));
    }

    // check if the username unique:
    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return next(handleErrors(400, "Username Already taken!"));
    }

    // check if the email unique:
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(handleErrors(400, "Email Already taken!"));
    }
    // check if the password complex or not:
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    if (!passwordRegex.test(password) || passwordRegex.length < 8) {
      return next(
        handleErrors(
          400,
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character!"
        )
      );
    }

    // hash password:
    const hashedPassword = bcryptjs.hashSync(password, 15);
    // create new User:
    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookies(newUser._id, res);
      await newUser.save();
      const { password, ...rest } = newUser._doc;
      res.status(201).json(rest);
    } else {
      return next(handleErrors(400, "Invalid User Data!"));
    }
  } catch (error) {
    console.log("Error In Creating Sign Up Api Route", error.message);
    next(error);
  }
};

// 2-Function To Sign In:
export const signIn_post = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || username === "" || password === "") {
      return next(handleErrors(400, "Please Enter All Required Fields!"));
    }
    // find the user:
    const user = await User.findOne({ username });
    if (!user) {
      return next(handleErrors(400, "Invalid Credentials!"));
    }

    // check if the password correct:
    const isMatchedPassword = bcryptjs.compareSync(
      password,
      user?.password || 0
    );
    if (!isMatchedPassword) {
      return next(handleErrors(400, "Invalid Credentials!"));
    }

    // generate token:
    generateTokenAndSetCookies(user._id, res);

    const { password: pass, ...rest } = user._doc;
    // send respose back:
    res.status(200).json(rest);
  } catch (error) {
    console.log("Error In Creating Sign In Api Route", error.message);
    next(error);
  }
};

// 3-Function To Sign Out:
export const signOut_post = async (req, res, next) => {
  try {
    // clear cookies:
    res.cookie('jwt_token', '', {maxAge:0})
    res.status(200).json({message:"User Sign Out Successful!"})
  } catch (error) {
    console.log("Error In Creating Sign Out Api Route", error.message);
    next(error);
    
  }
};
