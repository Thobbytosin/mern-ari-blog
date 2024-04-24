import { Alert, Button, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (comment.length > 200) {
    //   return;
    // }
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
      }
    } catch (error) {
      setCommentError(error.message);
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
    </div>
  );
};

export default CommentSection;
