import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  createPost,
  deletePost,
  getPosts,
} from "../controllers/posts.controller.js";

const router = express.Router();

router.post("/create", verifyUser, createPost);
router.get("/getPost", getPosts);
router.delete("/deletePost/:postId/:userId", verifyUser, deletePost);

export default router;
