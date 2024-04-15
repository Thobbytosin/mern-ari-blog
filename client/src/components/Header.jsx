import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Navbar,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import styles from "../styles";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const path = useLocation().pathname;

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
          <Button className=" w-12 h-10 hidden sm:inline" color="gray" pill>
            <FaMoon />
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
              <Dropdown.Item>Sign Out</Dropdown.Item>
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
    </div>
  );
};

export default Header;
