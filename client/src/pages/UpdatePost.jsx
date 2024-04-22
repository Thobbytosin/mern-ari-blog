import React, { useEffect, useState } from "react";
import styles from "../styles";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdatePost = () => {
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  //   console.log(formData);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/post/getPost?postId=${postId}`);
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        setFormData(data.posts[0]);
      }
    };

    fetchPosts();
  }, [postId]);

  const handleImageUpload = async () => {
    // setFileUploadSuccess(null);
    // setFileUploadError(null);

    try {
      if (!file) return setFileUploadError("Please select an image");

      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // upload progress
          const uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(Math.round(uploadProgress));
        },
        // upload error
        (error) => {
          setFileUploadError(
            "Error uploading image. Image must be less than 2MB"
          );
          setFileUploadSuccess(null);
        },
        // upload success
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUploadSuccess("Image uploaded successfully");
            setFileUploadError(null);
            setFileUploadProgress(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setFileUploadError("Image Upload failed");
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatePost/${formData?._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setPublishError(data.message);
        setPublishSuccess(null);
        return;
      } else {
        setPublishError(null);
        setPublishSuccess("Post Created Successfully");
        setTimeout(() => {
          navigate(`/post/${data.slug}`);
        }, 2000);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  return (
    <div
      className={`${styles.padding} min-h-screen max-w-3xl mx-auto text-center font-poppins mb-12`}
    >
      <h1 className=" text-center font-semibold my-7 text-3xl">Update Post</h1>
      <form onSubmit={handlePublish} className=" flex flex-col gap-4 mb-4">
        <div className=" flex flex-col sm:flex-row gap-4">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            required
            className=" flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData?.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData?.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className=" border-teal-500 border-dotted border-4 p-3 flex gap-4 items-center justify-between ">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone={"greenToBlue"}
            size="sm"
            outline
            onClick={handleImageUpload}
            disabled={fileUploadProgress && fileUploadProgress < 100}
          >
            {fileUploadProgress && fileUploadProgress < 100 ? (
              <div className=" w-12 h-12">
                <CircularProgressbar
                  value={fileUploadProgress}
                  text={`${fileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {fileUploadSuccess && (
          <Alert color="success">{fileUploadSuccess}</Alert>
        )}
        {fileUploadError && <Alert color="failure">{fileUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something.."
          className=" h-72 mb-12"
          onChange={(value) => setFormData({ ...formData, content: value })}
          value={formData?.content}
        />
        <Button type="submit" gradientMonochrome={"purple"} size="sm">
          Update Post
        </Button>
      </form>
      {publishError && <Alert color="failure">{publishError}</Alert>}
      {publishSuccess && <Alert color="success">{publishSuccess}</Alert>}
    </div>
  );
};

export default UpdatePost;
