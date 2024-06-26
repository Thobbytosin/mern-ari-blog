import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// SIGN UP
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

  const hasLowercaseLetter = () => !!password.match(/[a-z]/);
  const hasUppercaseLetter = () => !!password.match(/[a-z]/);
  const hasNumber = () => !!password.match(/[0-9]/);

  // Password Test
  const passwordIsArbitrarilyStrongEnough =
    hasNumber(password) &&
    hasUppercaseLetter(password) &&
    hasLowercaseLetter(password);

  if (password.length < 8)
    return next(errorHandler(400, "Password must be at least 8 characters"));

  if (!passwordIsArbitrarilyStrongEnough)
    return next(
      errorHandler(
        400,
        "Password must contain at least one Uppercase letter, one lowercase letter and a number"
      )
    );

  const cryptedPassword = bcryptjs.hashSync(password, 10);
  try {
    const newUser = new User({
      username,
      email,
      password: cryptedPassword,
    });
    await newUser.save();

    res.status(200).json("User registered successfully");
  } catch (err) {
    next(err);
  }
};

// SIGN IN
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === " " || password === " ") {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(400, "Wrong Credentials"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(400, "Wrong Credentials"));

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET_KEY
    );
    const { password: pass, ...rest } = validUser._doc;
    // console.log(pass);

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, photo } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY
      );
      const { password: pass, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: photo,
      });

      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET_KEY
      );
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
