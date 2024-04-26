import { response } from "express";
import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if (userId !== req.user.id)
      return next(errorHandler(403, "Permission denied to post a comment"));
    const newComment = new Comment({ content, postId, userId });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(errorHandler(400, "Comment not found"));
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.noOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.noOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return next(errorHandler(400, "Comment not found"));

    if (req.user.id !== comment.userId && !req.user.isAdmin)
      return next(errorHandler(403, "Access restricted"));
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(errorHandler(400, "Comment not found"));

    if (req.user.id !== comment.userId && !req.user.isAdmin)
      return next(errorHandler(403, "Access denied to delete comment"));

    await comment.deleteOne();
    res.status(200).json("Comment deleted");
  } catch (error) {
    next(error);
  }
};
