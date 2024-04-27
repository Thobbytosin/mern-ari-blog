import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import styles from "../styles";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentPosts2, setRecentPosts2] = useState([]);
  const [postLimit, setPostLimit] = useState(3);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getPost?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      const res = await fetch(`/api/post/getPost?limit=3`);
      if (res.ok) {
        const data = await res.json();
        setRecentPosts(data.posts);
      }
    };

    fetchRecentPosts();
  }, []);

  if (loading)
    return (
      <div className=" min-h-screen flex justify-center items-center">
        <Spinner size="xl" />
      </div>
    );
  return (
    <div
      className={`min-h-screen ${styles.padding} font-poppins max-w-6xl mx-auto flex flex-col `}
    >
      <h1 className="mt-10 text-center font-semibold text-3xl lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="mt-5 self-center"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt="blog_image"
        className=" max-h-[600px] object-cover mt-10 w-full"
      />
      <div className=" w-full flex justify-between items-center pb-3 border-b-2 border-slate-500 mt-3">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: post && post.content }}
        className=" mt-7 post-content"
      />
      <div className=" w-full max-w-4xl mx-auto">
        <CallToAction />
      </div>

      <CommentSection postId={post && post._id} />

      <div className=" w-full mt-20">
        <h2 className=" text-2xl text-center">Recent Articles</h2>
        <div className=" flex md:flex-row flex-col gap-4 justify-center my-3">
          {recentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
