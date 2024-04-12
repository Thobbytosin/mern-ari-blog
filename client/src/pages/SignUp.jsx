import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles";

const SignUp = () => {
  return (
    <div className={`${styles.paddingX} min-h-screen mt-20 font-poppins`}>
      <div className=" flex md:flex-row flex-col md:items-center justify-center max-w-3xl mx-auto gap-4">
        <div className="flex-1">
          <Link
            to={"/"}
            className=" self-center whitespace-nowrap text-gradient font-semibold font-poppins text-4xl"
          >
            Ari Blog
          </Link>
          <p className=" text-sm mt-4 text-left">
            Welcome to Ari Blog | Your Number one stop for entertainment,
            lifestyles, latest news & trends. You can sign up with your email
            and password or with your Google account.
          </p>
        </div>
        <div className=" flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Username" />
              <TextInput type="text" placeholder="Username" id="username" />
            </div>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput type="password" placeholder="Password" id="password" />
            </div>
            <Button gradientDuoTone={"greenToBlue"} outline>
              Sign Up
            </Button>
          </form>
          <div className=" mt-4">
            <span>Have an account?</span>
            <Link to={"/sign-in"} className="text-green-500 ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
