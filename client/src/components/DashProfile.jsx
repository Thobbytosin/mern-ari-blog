/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Button, Progress, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const fileRef = useRef();
  const [imageFileUploadProgess, setImageFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    // setImageFileUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    uploadImage();
  }, [imageFile]);

  const uploadImage = async () => {
    setFileUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile?.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      // upload percentage
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(Math.round(progress));
      },
      // upload error
      (error) => {
        setFileUploadError(
          "Could not upload image. File must be less than 2Mb"
        );
        setImageFileUploadProgress(null);
      },
      // upload success
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileUploadError(null);
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto w-full">
      <h1 className=" text-center font-semibold my-7 text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileRef}
          hidden
        />
        <div className="relative w-32 h-32 rounded-full self-center  cursor-pointer shadow-md ">
          <img
            src={imageFileUrl || currentUser.avatar}
            alt="profile_picture"
            className={`w-full h-full rounded-full object-cover border-4 border-teal-500 z-10 ${
              imageFileUploadProgess &&
              imageFileUploadProgess < 100 &&
              "opacity-55"
            }`}
            onClick={() => fileRef.current.click()}
          />
        </div>
        {imageFileUploadProgess &&
          !fileUploadError &&
          imageFileUploadProgess < 100 && (
            <Progress
              progress={imageFileUploadProgess}
              textLabel={
                imageFileUploadProgess === 100 ? "Complete" : "Uploading"
              }
              size="lg"
              labelProgress
              labelText
            />
          )}
        {fileUploadError && <Alert color="failure">{fileUploadError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" gradientDuoTone="greenToBlue" outline>
          Update
        </Button>
      </form>
      <div className=" flex justify-between mt-4">
        <span className=" text-red-600 cursor-pointer text-sm ">
          Delete Account
        </span>
        <span className=" text-red-600 cursor-pointer text-sm ">Sign out</span>
      </div>
    </div>
  );
};

export default DashProfile;
