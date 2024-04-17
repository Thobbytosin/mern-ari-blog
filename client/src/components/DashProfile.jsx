/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Button,
  Modal,
  Progress,
  Spinner,
  TextInput,
} from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import "react-circular-progressbar/dist/styles.css";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashProfile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const fileRef = useRef();
  const [imageFileUploadProgess, setImageFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const dispatch = useDispatch();
  const [updateUserSuccess, setUpdateUserSucess] = useState(null);
  const [updateUserFailure, setUpdateUserFailure] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteUserFail, setDeleteUserFail] = useState(null);
  const [showSignOutModal, setShowSignOutmodal] = useState(null);

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
    setImageUploading(true);

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
        setImageUploading(false);
      },
      // upload success
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileUploadError(null);
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
          setImageUploading(false);
          setUpdateUserFailure(null);
          setUpdateUserSucess("Profile updated succesfully");
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdateUserFailure(null);
    setUpdateUserSucess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserFailure("No changes made");
      return;
    }

    if (
      imageFileUploadProgess &&
      imageFileUploadProgess > 0 &&
      imageFileUploadProgess < 100 &&
      imageUploading
    ) {
      setUpdateUserFailure("Please wait for image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setUpdateUserFailure(data.message);
        dispatch(updateFailure(data.message));
      } else {
        setUpdateUserSucess("Profile updated succesfully");
        dispatch(updateSuccess(data));
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        setDeleteUserFail(data.message);
      } else {
        setDeleteUserFail(null);
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignoutUser = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full font-poppins">
      <h1 className=" text-center font-semibold my-7 text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          disabled={loading}
          type="submit"
          gradientDuoTone="greenToBlue"
          outline
        >
          {loading ? (
            <span>
              <Spinner size="sm" /> Loading...
            </span>
          ) : (
            "Update"
          )}
        </Button>
      </form>
      <div className=" flex justify-between my-4">
        <span
          onClick={() => setShowModal(true)}
          className=" text-red-600 cursor-pointer text-sm "
        >
          {loading ? (
            <span>
              <Spinner size="sm" />
            </span>
          ) : (
            "Delete Account"
          )}
        </span>
        <span
          onClick={() => setShowSignOutmodal(true)}
          className=" text-red-600 cursor-pointer text-sm "
        >
          {loading ? (
            <span>
              <Spinner size="sm" />
            </span>
          ) : (
            "Sign Out"
          )}
        </span>
      </div>
      {updateUserSuccess && <Alert color="success">{updateUserSuccess}</Alert>}
      {updateUserFailure && <Alert color="failure">{updateUserFailure}</Alert>}
      {deleteUserFail && <Alert color="failure">{deleteUserFail}</Alert>}

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
                Are you sure you want to delete your account?
              </h3>
              <div className=" flex items-center gap-4  w-full justify-center">
                <Button onClick={handleDeleteUser} color="failure">
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
      {showSignOutModal && (
        <Modal
          show={showSignOutModal}
          onClose={() => setShowSignOutmodal(false)}
          size="md"
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className=" h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-200" />
              <h3 className=" text-lg font-poppins text-gray-600 dark:text-gray-400 mb-5 ">
                Are you sure you want to signout?
              </h3>
              <div className=" flex items-center gap-4  w-full justify-center">
                <Button
                  onClick={handleSignoutUser}
                  gradientDuoTone={"greenToBlue"}
                >
                  Yes, I'm sure
                </Button>
                <Button onClick={() => setShowSignOutmodal(false)} color="gray">
                  No, Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default DashProfile;
