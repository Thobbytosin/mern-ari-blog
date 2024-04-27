import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  useEffect(() => {
    const fetchRecentPosts = async () => {
      const res = await fetch(`/api/post/getPost?limit=6`);
      if (res.ok) {
        const data = await res.json();
        setRecentPosts(data.posts);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div className=" font-poppins">
      <div className="flex flex-col gap-6 p-28 md:px-16 px-8 max-w-6xl mx-auto ">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-medium hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="md:mx-16 mx-8">
        <CallToAction />
      </div>
      <div className="md:px-16 px-8  max-w-6xl mx-auto mt-20">
        <h2 className=" text-2xl text-center">Recent Articles</h2>
        <div className=" flex flex-wrap gap-4 justify-center my-3">
          {recentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
