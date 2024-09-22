import React from "react";
import XSvg from "../../../components/svgs/X";
import { IoLogoTwitter } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { VscDebugBreakpointData } from "react-icons/vsc";
import { BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const isError = false;

  const [formData, setFormData] = useState({
    username: "",
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
    <div className="max-w-screen-xl mx-auto h-screen flex">
      {/* svg start here */}
      <div className="hidden flex-1 lg:flex items-center justify-center">
        <XSvg className="w-2/3 fill-[#1da1f2]" />
      </div>
      {/* svg end here */}
      {/* form start here */}
      <div className="flex flex-col items-center justify-center flex-1 ">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <BsTwitterX className=" text-[90px] lg:hidden mx-auto !text-[#1da1f2]" />
          <h1 className="text-4xl text-gray-200 font-mono font-bold flex items-center justify-center gap-2">
            {"Let's"} Go <IoLogoTwitter className="text-[#1da1f2] -mt-[30px]" />
          </h1>
          <label className="input border border-[#1da1f2] rounded-lg flex items-center gap-2">
            <FaUser className="w-5 h-5 hover:text-[#1da1f2] cursor-pointer" />
            <input
              type="text"
              placeholder="Enter your username..."
              className="grow"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </label>
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
          <button
            type="submit"
            className="btn btn-primary uppercase rounded-full text-white font-semibold"
          >
            Sign In
          </button>
          {isError && (
            <p className="text-red-600 font-semibold capitalize text-center">
              Something went wrong
            </p>
          )}
        </form>
        {/* form end here */}
        <div className="flex flex-col gap-2 mt-5">
          <p className="text-gray-400 font-semibold flex items-center justify-start gap-1 italic capitalize">
            <VscDebugBreakpointData className="text-[#1da1f2]" />
            {"Don't"} have an account?
          </p>
          <Link to={"/sign-up"}>
            <button className="btn btn-primary hover:btn-error rounded-full uppercase w-full font-semibold hover:text-gray-50  text-white">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
