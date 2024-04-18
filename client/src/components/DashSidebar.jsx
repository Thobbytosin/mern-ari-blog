/* eslint-disable react/no-unescaped-entities */
import { Button, Modal, Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiUser,
  HiArrowRight,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [showSignOutModal, setShowSignOutmodal] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  const handleSignoutUser = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setShowSignOutmodal(null);
        dispatch(signOutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Sidebar className=" w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Link to={"/dashboard?tab=profile"}>
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label={currentUser.isAdmin ? "Admin" : "User"}
                labelColor={currentUser.isAdmin ? "success" : "dark"}
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>
            <Link
              onClick={() => setShowSignOutmodal(true)}
              className=" cursor-pointer"
            >
              <Sidebar.Item icon={HiArrowRight}>Sign Out</Sidebar.Item>
            </Link>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
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
    </>
  );
};

export default DashSidebar;
