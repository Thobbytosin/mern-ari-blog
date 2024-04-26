import { Alert, Button, Modal, Table, Toast } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState("");
  const [userDeleted, setUserDeleted] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments`);
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    currentUser.isAdmin && fetchComments();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const startIndex = comments.length;
      const res = await fetch(
        `/api/comment/getComments?startIndex=${startIndex}`
      );
      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        setUserDeleted(false);
      } else {
        setUserDeleted(data);
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-auto sm:overflow-x-auto  w-full  font-poppins scrollbar scrollbar-track-slate-100 dark:scrollbar-track-slate-700 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
      {currentUser.isAdmin && comments?.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>Post Id</Table.HeadCell>
              <Table.HeadCell>User Id</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {comments?.map((comment, i) => (
                <Table.Row
                  key={i + 1}
                  className=" bg-gray-100 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.noOfLikes}</Table.Cell>
                  <Table.Cell>{comment._id}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserDeleted(false);
                        setCommentToDelete(comment._id);
                      }}
                      className=" font-medium text-red-500 hover:opacity-55 cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <p>No Comments yet</p>
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
                Are you sure you want to delete this comment?
              </h3>
              <div className=" flex items-center gap-4  w-full justify-center">
                <Button onClick={handleDeleteComment} color="failure">
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
      {userDeleted && (
        <Alert color="success" size="sm" className=" my-7">
          <div className="ml-3 text-sm font-normal">{userDeleted}.</div>
        </Alert>
      )}
    </div>
  );
};

export default DashComments;
