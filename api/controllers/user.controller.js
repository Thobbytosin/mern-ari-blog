import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "API Working",
  });
};

export const update = async (req, res, next) => {
  if (req.user.id !== req.params.userId)
    return next(errorHandler(403, "You are not allowed to update this user"));
  if (req.body.password) {
    if (req.body.password.length < 6)
      return next(errorHandler(400, "Password must be at least 6 characters"));
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 6)
      return next(errorHandler(400, "Username must be at least 6 characters"));
  }
  if (req.body.email) {
    if (req.body.email.length < 6)
      return next(
        errorHandler(400, "Email field must be at least 6 characters")
      );
  }
  if (req.body.username?.includes(" "))
    return next(errorHandler(400, "Username cannot contain spaces"));
  if (req.body.username !== req.body.username?.toLowerCase())
    return next(errorHandler(400, "Username must be in lowercase"));
  if (!req.body.username?.match(/^[a-zA-z0-9]+$/))
    return next(
      errorHandler(400, "Username can only contain letters and numbers")
    );

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
