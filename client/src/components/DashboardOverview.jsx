import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashboardOverview = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState({});
  const [posts, setPosts] = useState({});
  const [comments, setComments] = useState({});
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getUsers?limit=5");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getPost");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getComments?limit=5");
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);
  return (
    <div className="table-auto overflow-x-auto sm:overflow-x-auto scrollbar scrollbar-track-slate-100 dark:scrollbar-track-slate-700 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
      <div className=" flex justify-center gap-4 flex-col md:flex-row">
        {/* TOTAL USERS */}
        <div className=" md:w-72 w-full shadow-md dark:shadow-black rounded-md flex p-3">
          <div className=" text-start flex flex-col gap-2">
            <h2 className="text-lg font-medium ">TOTAL POSTS</h2>
            <p className=" font-medium text-[1.4rem]">{users.totalUsers}</p>
            <p className=" flex items-center text-gray-500 text-sm">
              <span className=" text-green-500 text-sm flex items-center mr-2">
                <HiArrowNarrowUp />
                {users.lastMonthUsers}
              </span>
              Last month
            </p>
          </div>
        </div>

        {/* TOTAL POSTS */}
        <div className=" md:w-72 w-full shadow-md dark:shadow-black rounded-md flex p-3">
          <div className=" text-start flex flex-col gap-2">
            <h2 className="text-lg font-medium ">TOTAL USERS</h2>
            <p className=" font-medium text-[1.4rem]">{posts.totalPosts}</p>
            <p className=" flex items-center text-gray-500 text-sm">
              <span className=" text-green-500 text-sm flex items-center mr-2">
                <HiArrowNarrowUp />
                {posts.lastMonthPosts}
              </span>
              Last month
            </p>
          </div>
        </div>

        {/* TOTAL COMMENTS */}
        <div className=" md:w-72 w-full shadow-md dark:shadow-black rounded-md flex p-3">
          <div className=" text-start flex flex-col gap-2">
            <h2 className="text-lg font-medium ">TOTAL COMMENTS</h2>
            <p className=" font-medium text-[1.4rem]">
              {comments.totalComments}
            </p>
            <p className=" flex items-center text-gray-500 text-sm">
              <span className=" text-green-500 text-sm flex items-center mr-2">
                <HiArrowNarrowUp />
                {comments.lastMonthComments}
              </span>
              Last month
            </p>
          </div>
        </div>
      </div>

      <div className=" p-3 flex flex-wrap gap-4 justify-center  mt-5 ">
        {/* RECENT USERS */}
        <div className=" w-full md:w-auto shadow-md dark:shadow-black rounded-md flex flex-col p-3">
          <div className=" flex justify-between mb-5 items-center">
            <h2 className=" font-semibold text-sm">Recent Users</h2>
            <Link to={"/dashboard?tab=users"}>
              <Button
                gradientDuoTone={"greenToBlue"}
                size="sm"
                outline
                as="button"
              >
                See All
              </Button>
            </Link>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {users.users?.map((user) => (
                <Table.Row key={user._id}>
                  <Table.Cell>
                    <img
                      src={user.avatar}
                      alt="user_image"
                      className=" w-10 h-10  object-cover bg-slate-300 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* RECENT COMMENTS */}
        <div className=" w-full md:w-auto shadow-md dark:shadow-black rounded-md p-3">
          <div className=" flex justify-between mb-5 items-center">
            <h2 className=" font-semibold text-sm">Recent Comments</h2>
            <Link to={"/dashboard?tab=comments"}>
              <Button
                gradientDuoTone={"greenToBlue"}
                size="sm"
                outline
                as="button"
              >
                See All
              </Button>
            </Link>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {comments.comments?.map((comment) => (
                <Table.Row key={comment._id}>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.noOfLikes}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* RECENT POSTS */}
        <div className=" w-full md:w-auto shadow-md dark:shadow-black rounded-md p-3">
          <div className=" flex justify-between mb-5 items-center">
            <h2 className=" font-semibold text-sm">Recent Posts</h2>
            <Link to={"/dashboard?tab=posts"}>
              <Button
                gradientDuoTone={"greenToBlue"}
                size="sm"
                outline
                as="button"
              >
                See All
              </Button>
            </Link>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {posts.posts?.map((post) => (
                <Table.Row key={post._id}>
                  <Table.Cell>
                    <img
                      src={post.image}
                      alt="blog_image"
                      className=" w-14 h-10 rounded-md object-cover"
                    />
                  </Table.Cell>
                  <Table.Cell>{post.title}</Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
