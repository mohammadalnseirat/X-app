import React, { useState } from "react";
import XSvg from "../../../components/svgs/X";
import { IoLogoTwitter } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { VscDebugBreakpointData } from "react-icons/vsc";
import { BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  // use useQuery to navigate to home page when login is successful:
  const queryClient = useQueryClient();
  // Add useMutation from react-query:
  const {
    mutate: SignInMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        // create a response:
        const res = await fetch("/api/v1/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        // convert data to json:
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed To Sign In");
        }
        if (res.ok) {
          return data;
        }
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("User signed in successfully!");
      // refetch the user data :
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // handle change the inputs:
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  // handle Submit the form:
  const handleSubmit = (e) => {
    e.preventDefault(); // page wont reload when submitting the form
    SignInMutation(formData); // call the mutation function
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
            disabled={isPending}
            type="submit"
            className="btn btn-primary uppercase rounded-full text-white font-semibold"
          >
            {isPending ? (
              <>
                <span className="loading loading-infinity loading-lg text-[#1da1f2]"></span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
          {/* Another Way to Show The Error */}
          {/* {isError && (
            <p className="text-red-600 font-semibold capitalize text-center">
              {error.message}
            </p>
          )} */}
        </form>
        {/* form end here */}
        <div className="flex flex-col gap-2 mt-5">
          <p className="text-gray-400 font-semibold flex items-center gap-1 italic capitalize">
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
