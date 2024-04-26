import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUser();
  }, [comment]);

  const toggleEditComment = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });
      if (res.ok) {
        setIsEditing(false);
        const data = await res.json();
        console.log(data);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className=" flex items-start gap-4 mb-4">
      <div className="">
        <img
          src={user.avatar}
          alt="user_image"
          className=" w-10 h-10 object-cover rounded-full"
        />
      </div>
      <div className=" flex-1">
        <p className="  text-xs">
          <span className="font-semibold truncate">
            {user ? `@${user.username}` : "@anonymous user"}
          </span>
          <span className="text-gray-400 ml-4">
            {moment(comment.createdAt).fromNow()}
          </span>
        </p>
        {isEditing ? (
          <>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className=" flex-1 mt-2 flex justify-end gap-2">
              <Button
                onClick={handleSave}
                type="submit"
                gradientDuoTone={"greenToBlue"}
                size="sm"
              >
                Save
              </Button>
              <Button
                type="button"
                gradientDuoTone={"greenToBlue"}
                outline
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div>
            <p className=" mt-2 text-xs text-gray-400">{comment.content}</p>
            <div className="flex gap-2 items-center mt-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`${
                  currentUser &&
                  comment.likes?.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-xs" />
              </button>
              <p className=" text-xs text-gray-500">
                {comment.noOfLikes > 0 &&
                  `${comment.noOfLikes} ${
                    comment.noOfLikes === 1 ? "Like" : "Likes"
                  }`}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    onClick={toggleEditComment}
                    className=" text-xs text-gray-500"
                  >
                    Edit
                  </button>
                )}
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    onClick={() => onDelete(comment._id)}
                    className=" text-xs text-red-400 "
                  >
                    Delete
                  </button>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
