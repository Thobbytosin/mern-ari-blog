import React, { useEffect, useState } from "react";
import moment from "moment";

const Comment = ({ comment }) => {
  const [user, setUser] = useState({});
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
      </div>
    </div>
  );
};

export default Comment;
