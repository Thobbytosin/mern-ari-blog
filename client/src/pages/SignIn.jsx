/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles";
import { useDispatch, useSelector } from "react-redux";
import {
  pageDefault,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(pageDefault());
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields."));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // console.log(res);
      const data = await res.json();

      if (data.success === false) {
        return dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        setTimeout(() => {
          navigate("/");
        }, 2500);
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone={"greenToBlue"}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <Spinner size="sm" /> Loading...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <OAuth />
          <div className=" mt-4">
            <span>{`Don't have an account?`}</span>
            <Link to={"/sign-up"} className="text-green-500 ml-1">
              Sign Up
            </Link>
          </div>
          {error && (
            <Alert className="mt-5" color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
