import React, { useState } from "react";
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

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [fileUploadSuccess, setFileUploadSuccess] = useState(null);
  const [formData, setFormData] = useState({});
  console.log(file);
  // console.log(`progress:${fileUploadProgress}%`);
  // console.log(`Error: ${fileUploadError}`);
  // console.log(`success: ${fileUploadSuccess}`);
  // console.log(formData);

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
  return (
    <div
      className={`${styles.padding} min-h-screen max-w-3xl mx-auto text-center font-poppins mb-12`}
    >
      <h1 className=" text-center font-semibold my-7 text-3xl">Create Post</h1>
      <form className=" flex flex-col gap-4">
        <div className=" flex flex-col sm:flex-row gap-4">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            required
            className=" flex-1"
          />
          <Select>
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
        />
        <Button type="submit" gradientDuoTone={"greenToBlue"} size="sm">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
