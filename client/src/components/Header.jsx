/* eslint-disable react/no-unescaped-entities */
import {
  Avatar,
  Button,
  Dropdown,
  Modal,
  Navbar,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaMoon, FaSun } from "react-icons/fa";
import styles from "../styles";
import { useSelector, useDispatch } from "react-redux";
import { themeToggler } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const [showSignOutModal, setShowSignOutmodal] = useState(null);

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
    <div className={`border-b-2  ${styles.padding}`}>
      <Navbar className=" font-poppins">
        {/* LOGO */}
        <Link
          to={"/"}
          className=" self-center whitespace-nowrap text-gradient font-semibold font-poppins text-lg"
        >
          Ari Blog
        </Link>

        {/*SEARCH FORM  */}
        <form>
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className=" hidden lg:inline"
          />
        </form>
        <Button className=" w-12 h-10 lg:hidden " color="gray" pill>
          <AiOutlineSearch />
        </Button>

        {/*  THEME TOGGLER AND SIGN IN */}
        <div className="flex items-center gap-2.5 md:order-2">
          <Button
            className=" w-12 h-10 hidden sm:inline"
            color="gray"
            pill
            onClick={() => dispatch(themeToggler())}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </Button>
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="user" img={currentUser.avatar} rounded />}
            >
              <Dropdown.Header>
                <div className=" flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className=" font-semibold truncate">
                    {currentUser.username}
                  </span>
                </div>
              </Dropdown.Header>
              <Dropdown.Item>
                <Link to={"/dashboard?tab=profile"}>Profile</Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>
                <Link onClick={() => setShowSignOutmodal(true)}>Sign Out</Link>
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to={"/sign-in"}>
              <Button gradientDuoTone="greenToBlue" outline>
                Sign In
              </Button>
            </Link>
          )}

          {/* mobile menu */}
          <NavbarToggle />
        </div>

        {/* MENU NAV */}
        <Navbar.Collapse className=" font-poppins ">
          <NavbarLink className=" font-medium" as={"div"} active={path === "/"}>
            <Link to={"/"}>Home</Link>
          </NavbarLink>
          <NavbarLink
            className=" font-medium"
            as={"div"}
            active={path === "/about"}
          >
            <Link to={"/about"}>About</Link>
          </NavbarLink>
          <NavbarLink
            className=" font-medium"
            as={"div"}
            active={path === "/projects"}
          >
            <Link to={"/projects"}>Projects</Link>
          </NavbarLink>
        </Navbar.Collapse>
      </Navbar>

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

export default Header;
