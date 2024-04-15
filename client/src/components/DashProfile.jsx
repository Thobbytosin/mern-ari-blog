import { Button, TextInput } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser.avatar);

  return (
    <div className="max-w-lg mx-auto w-full">
      <h1 className=" text-center font-semibold my-7 text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 rounded-full self-center border-4 border-teal-500 overflow-hidden">
          <img
            src={currentUser.avatar}
            alt="profile_picture"
            className=" w-full h-full rounded-full object-cover"
          />
        </div>
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
