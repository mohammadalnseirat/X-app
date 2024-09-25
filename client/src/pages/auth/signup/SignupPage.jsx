import React, { useState } from "react";
import XSvg from "../../../components/svgs/X";
import {
  MdDriveFileRenameOutline,
  MdOutlineEmail,
  MdPassword,
} from "react-icons/md";
import { VscDebugBreakpointData } from "react-icons/vsc";
import { IoLogoTwitter } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const isError = false;
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });

  // handle change the inputs:
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  // handle Submit the form:
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="max-w-screen-xl min-h-screen flex px-10 mx-auto">
      {/* svg start here  */}
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="w-2/3 fill-[#1da1f2]" />
      </div>
      {/* svg end here */}
      {/* form start here */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col mx-auto gap-4 md:mx-20 lg:w-2/3"
        >
          <XSvg className="w-24 lg:hidden mx-auto fill-[#1da1f2]" />
          <h1 className="font-bold flex items-center justify-center gap-2 font-mono text-4xl  text-gray-200">
            Join Today
            <IoLogoTwitter className="text-[#1da1f2] -mt-[30px]" />
          </h1>
          {/* input start here */}
          <label className="input border border-[#1da1f2] rounded-lg flex items-center gap-2">
            <MdOutlineEmail className="w-5 h-5 hover:text-[#1da1f2] cursor-pointer" />
            <input
              type="email"
              placeholder="Enter your email..."
              className="grow"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="input border border-[#1da1f2] rounded-lg flex items-center gap-2 flex-1">
              <FaUser className="w-5 h-5 hover:text-[#1da1f2] cursor-pointer" />
              <input
                type="text"
                placeholder="Enter your name..."
                className="grow"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </label>
            <label className="input border border-[#1da1f2] rounded-lg flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline className="w-5 h-5 cursor-pointer hover:text-[#1da1f2]" />
              <input
                type="text"
                placeholder="Enter your Full Name..."
                className="grow"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <label className="input border border-[#1da1f2] rounded-lg flex items-center gap-2">
            <MdPassword className="w-5 h-5 hover:text-[#1da1f2] cursor-pointer" />
            <input
              type="password"
              placeholder="Enter your password..."
              className="grow"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>
          {/* input end here */}
          <button
            type="submit"
            className="btn btn-primary btn-outline rounded-full uppercase font-semibold  text-white"
          >
            Sign Up
          </button>
          {isError && (
            <p className="  text-red-600 font-semibold capitalize text-center ">
              Something went wrong!
            </p>
          )}
        </form>
        {/* form end here */}
        <div className="flex flex-col lg:w-2/3 mt-5 gap-2">
          <p className="text-gray-200 capitalize italic flex items-center gap-1">
            {" "}
            <VscDebugBreakpointData className="text-[#1da1f2]" />
            Already have an account?
          </p>
          <Link to={"/sign-in"}>
            <button className="btn btn-primary hover:btn-error rounded-full uppercase w-full font-semibold hover:text-gray-50  text-white">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
