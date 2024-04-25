import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
const Comment = ({ comment, onLike }) => {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);

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
        </div>
      </div>
    </div>
  );
};

export default Comment;
