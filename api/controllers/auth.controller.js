import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (
      !username ||
      !email ||
      !password ||
      username === " " ||
      email === " " ||
      password === " "
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cryptedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: cryptedPassword,
    });

    res.status(200).json({ message: "User registered successfully" });

    await newUser.save();
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};
