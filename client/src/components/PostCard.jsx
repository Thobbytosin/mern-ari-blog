import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className=" h-[240px] w-full flex flex-col justify-between border border-gray-500 rounded-xl overflow-clip ">
      <img
        src={post.image}
        alt="blog_image"
        className=" w-full h-[130px] object-cover"
      />
      <div className=" w-full  p-3  ">
        <h2 className=" font-semibold text-[0.88rem]  truncate">
          {post.title}
        </h2>
        <p className=" text-xs italic  my-2">{post.category}</p>
        <Link
          to={`/post/${post.slug}`}
          className=" block w-full text-center py-1 border border-gray-400 rounded-md text-teal-500 font-medium hover:bg-teal-500 hover:text-white hover:border-none transition-all duration-500"
        >
          Read Article
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
