import {
  Button,
  Navbar,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import styles from "../../styles";

const Header = () => {
  const path = useLocation().pathname;
  return (
    <div className={`border-b-2  ${styles.padding}`}>
      <Navbar className=" font-poppins">
        <Link
          to={"/"}
          className=" self-center whitespace-nowrap text-gradient font-semibold font-poppins text-lg"
        >
          Ari Blog
        </Link>
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
        <div className="flex items-center gap-2.5 md:order-2">
          <Button className=" w-12 h-10 hidden sm:inline" color="gray" pill>
            <FaMoon />
          </Button>
          <Link to={"/sign-in"}>
            <Button gradientDuoTone="greenToBlue" outline>
              Sign In
            </Button>
          </Link>
          <NavbarToggle />
        </div>
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
