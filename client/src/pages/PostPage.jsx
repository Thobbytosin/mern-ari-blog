import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import styles from "../styles";
import CallToAction from "../components/CallToAction";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getPost?slug=${postSlug}`);
        const data = await res.json();
        console.log(data);
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
      <CallToAction />
    </div>
  );
};

export default PostPage;
