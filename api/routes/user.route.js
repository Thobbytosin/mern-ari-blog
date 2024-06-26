import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  update,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyUser, update);
router.delete("/delete/:userId", verifyUser, deleteUser);
router.get("/signout", signout);
router.get("/getUsers", verifyUser, getUsers);
router.get("/:userId", getUser);

export default router;
