import { Alert, Button, Modal, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getComments();
  }, [postId]);

  const handleLikeComment = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });

      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  noOfLikes: data.noOfLikes,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // to effect the change on the ui
  const handleEdit = (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...comment, content: editedContent } : c
      )
    );
  };

  const handleDeleteComment = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();

        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="sm:max-w-2xl w-full mx-auto ">
      {currentUser ? (
        <div className=" flex items-center gap-2 text-sm mb-7">
          <p>Signed in as:</p>
          <img
            src={currentUser.avatar}
            alt="user_avatar"
            className=" w-5 h-5 rounded-full object-cover"
          />
          <Link
            to={`/dashboard?tab=profile`}
            className="  text-teal-500 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className=" text-center ">
          You must be signed in to comment:
          <Link to={"/sign-in"} className=" ml-2 text-teal-500 underline">
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className=" border border-teal-500 p-3 rounded-xl mb-3 "
        >
          <Textarea
            rows="3"
            maxLength="200"
            placeholder="Add a comment"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className=" flex justify-between items-center mt-5">
            <p
              className={`${
                200 - comment.length <= 10
                  ? "text-red-500"
                  : "text-gray-700 dark:text-gray-400"
              } text-sm`}
            >
              {200 - comment.length} characters remaining
            </p>
            <Button type="submit" gradientDuoTone="greenToBlue" outline>
              Submit
            </Button>
          </div>
        </form>
      )}
      {commentError && <Alert color="failure">{commentError}</Alert>}
      {comments.length === 0 ? (
        <p className=" text-sm mt-6 mb-3">No comments yet</p>
      ) : (
        <p className=" text-sm mt-6 mb-3">{`Comments (${comments.length})`}</p>
      )}

      {comments.map((postComment) => (
        <Comment
          key={comment._id}
          comment={postComment}
          onLike={handleLikeComment}
          onEdit={handleEdit}
          onDelete={(commentId) => {
            setShowModal(true);
            setCommentToDelete(commentId);
          }}
        />
      ))}

      {showModal && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          size="md"
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className=" h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-200" />
              <h3 className=" text-lg font-poppins text-gray-600 dark:text-gray-400 mb-5 ">
                Are you sure you want to delete this comment?
              </h3>
              <div className=" flex items-center gap-4  w-full justify-center">
                <Button
                  onClick={() => handleDeleteComment(commentToDelete)}
                  color="failure"
                >
                  Yes, I'm sure
                </Button>
                <Button onClick={() => setShowModal(false)} color="gray">
                  No, Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default CommentSection;
