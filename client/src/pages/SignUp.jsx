import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // console.log(res);
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        setTimeout(() => {
          navigate("/sign-in");
        }, 2500);
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage(error);
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
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
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
              outline
            >
              {loading ? (
                <span>
                  <Spinner size="sm" /> Loading...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className=" mt-4">
            <span>Have an account?</span>
            <Link to={"/sign-in"} className="text-green-500 ml-1">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
