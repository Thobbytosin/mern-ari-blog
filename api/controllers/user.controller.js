import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "API Working",
  });
};

export const update = async (req, res, next) => {
  const hasLowercaseLetter = () => !!req.body.password.match(/[a-z]/);
  const hasUppercaseLetter = () => !!req.body.password.match(/[a-z]/);
  const hasNumber = () => !!req.body.password.match(/[0-9]/);

  // Password Test
  const passwordIsArbitrarilyStrongEnough =
    hasNumber(req.body.password) &&
    hasUppercaseLetter(req.body.password) &&
    hasLowercaseLetter(req.body.password);

  if (req.user.id !== req.params.userId)
    return next(errorHandler(403, "You are not allowed to update this user"));
  if (req.body.password) {
    if (req.body.password.length < 8)
      return next(errorHandler(400, "Password must be at least 8 characters"));
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.password) {
    if (!passwordIsArbitrarilyStrongEnough)
      return next(
        errorHandler(
          400,
          "Password must contain at least one Uppercase letter, one lowercase letter and a number"
        )
      );
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

  if (req.body.username) {
    if (req.body.username?.includes(" "))
      return next(errorHandler(400, "Username cannot contain spaces"));
  }

  if (req.body.username) {
    if (req.body.username !== req.body.username?.toLowerCase())
      return next(errorHandler(400, "Username must be in lowercase"));
  }

  if (req.body.username) {
    if (!req.body.username?.match(/^[a-zA-z0-9]+$/))
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
  }

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

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId)
    return next(errorHandler(400, "You are not allowed to delete this user"));
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("Signed out successfully");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, "Access denied to get users"));

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const userWithOutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      users: userWithOutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
