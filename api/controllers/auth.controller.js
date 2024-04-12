import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === " " ||
    email === " " ||
    password === " "
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  const cryptedPassword = bcryptjs.hashSync(password, 10);
  try {
    const newUser = new User({
      username,
      email,
      password: cryptedPassword,
    });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};
