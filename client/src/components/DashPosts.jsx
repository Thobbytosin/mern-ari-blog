import { Alert, Button, Modal, Table, Toast } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle, HiCheck } from "react-icons/hi";

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState("");
  const [postDeleted, setPostDeleted] = useState(null);
  // console.log(postToDeleteId);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getPost?userId=${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    currentUser.isAdmin && fetchPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const startIndex = userPosts.length;
      const res = await fetch(
        `/api/post/getPost?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();

      if (res.ok) {
        setUserPosts((prev) => [...prev, data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletePost/${postToDeleteId}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      // console.log(res);

      if (!res.ok) {
        console.log(data.message);
        setPostDeleted(false);
      } else {
        setPostDeleted(data);
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postToDeleteId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-auto sm:overflow-x-auto  w-full  font-poppins scrollbar scrollbar-track-slate-100 dark:scrollbar-track-slate-700 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
      {currentUser.isAdmin && userPosts?.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {userPosts?.map((post, i) => (
                <Table.Row
                  key={i + 1}
                  className=" bg-gray-100 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className=" w-10 h-10 sm:w-20 sm:h-20 object-cover bg-slate-300"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostDeleted(false);
                        setPostToDeleteId(post._id);
                      }}
                      className=" font-medium text-red-500 hover:opacity-55 cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className=" font-medium text-teal-500 hover:underline">
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <p>No Posts yet</p>
      )}
      {showMore && (
        <button
          onClick={handleShowMore}
          className=" w-full text-center my-4 text-sm text-teal-600 font-medium hover:text-gray-400"
        >
          Show More
        </button>
      )}
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
                Are you sure you want to delete this post?
              </h3>
              <div className=" flex items-center gap-4  w-full justify-center">
                <Button onClick={handleDeletePost} color="failure">
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
      {postDeleted && (
        <Alert color="success" size="sm" className=" my-7">
          <div className="ml-3 text-sm font-normal">{postDeleted}.</div>
        </Alert>
      )}
    </div>
  );
};

export default DashPosts;
