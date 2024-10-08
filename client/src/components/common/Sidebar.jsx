import React from "react";
import XSvg from "../svgs/X";
import { Link, useLocation } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
  const loaction = useLocation();
  const path = loaction.pathname;
  const { data: authUser } = useQuery({ queryKey: ["authUser"] }); // to get the data and show it in the ui:
  const queryClient = useQueryClient();
  // Add useMutation from react-query to fetch data from server:
  const {mutate: LogOutMutation,} = useMutation({
    mutationFn: async () => {
      try {
        // create a response:
        const res = await fetch("/api/v1/auth/signout", {
          method: "POST",
        });
        // convert data to json:
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("User has been signed out successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <div className="md:flex-[2_2_0] max-w-52 w-18">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-r-blue-400 w-20 md:w-full">
        {/* logo start here */}
        <Link to="/" className="flex justify-center  mt-2">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-[#1da1f2]" />
        </Link>
        {/* logo end here */}
        {/* menu start here */}
        <ul className="flex flex-col gap-4 mt-5">
          <li className="flex justify-center md:justify-start">
            <Link
              to={"/"}
              className={`flex items-center justify-center md:justify-start gap-3 text-slate-100 hover:bg-[#1da1f2] transition-all duration-150 rounded-xl font-semibold py-1 px-2 md:mr-1 md:w-full cursor-pointer ${
                path === "/" && "bg-[#1da1f2]"
              }`}
            >
              <MdHomeFilled className="w-8 md:w-6 h-8 md:h-6 " />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={"/notifications"}
              className={`flex justify-center md:justify-start items-center font-semibold text-slate-100 gap-3 hover:bg-[#1da1f2] rounded-xl py-1 px-2 md:mr-1 md:w-full cursor-pointer transition-all duration-150 ${
                path === "/notifications" && "bg-[#1da1f2]"
              }`}
            >
              <IoIosNotifications className="w-8 md:w-7 h-8 md:h-7" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>
          <li className="flex jsutify-center  md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className={`flex mx-auto md:mx-0 justify-center md:justify-start items-center font-semibold text-slate-100 gap-3 hover:bg-[#1da1f2] rounded-xl py-1 px-2 md:mr-1 md:w-full cursor-pointer transition-all duration-150 ${
                path === `/profile/${authUser?.username}` && "bg-[#1da1f2]"
              }`}
            >
              <FaUser className="w-6 md:w-5 h-6 md:h-5" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {/* menu end here */}
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 mx-auto md:mx-0 flex gap-2 justify-center items-start transition-all duration-300 hover:bg-[#1da1f2]  py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img
                  src={authUser?.profileImage || "/avatar-placeholder.png"}
                />
              </div>
            </div>
            <div className="flex justify-between flex-1 ">
              <div className="hidden md:block ">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-100 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-6  h-6 text-2xl   cursor-pointer"
                title="Logout"
                onClick={(e) => {
                  e.preventDefault();
                  LogOutMutation();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
