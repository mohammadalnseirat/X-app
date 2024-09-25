import React from "react";
import { VscDebugBreakpointData } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import { FaHeart, FaTrash, FaUser } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Link } from "react-router-dom";

const NotificationPage = () => {
  const isLoading = false;
  const notifications = [
    {
      _id: "1",
      from: {
        _id: "1",
        username: "johndoe",
        profileImage: "/avatars/boy2.png",
      },
      type: "follow",
    },
    {
      _id: "2",
      from: {
        _id: "2",
        username: "janedoe",
        profileImage: "/avatars/girl1.png",
      },
      type: "like",
    },
  ];
  return (
    <>
      <div className="flex-[4_4_0] border-r border-[#1DA1F2]  min-h-screen">
        {/* Header Start here */}
        <div className="flex items-center justify-between p-4 border-b border-b-gray-700">
          <p className="font-mono font-bold text-lg flex items-center gap-1">
            <VscDebugBreakpointData className="text-md text-[#1DA1F2]" />
            Notifications:
          </p>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-6 h-6 hover:text-[#1DA1F2]" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu z-[1] p-2 shadow-sm bg-base-100 rounded-box w-52"
            >
              <li className="text-red-500 font-semibold   hover:bg-red-500 hover:text-gray-50">
                <a>Delete All Notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {/* Header End here */}
        {/* content notifications start here */}
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size={"lg"} />
          </div>
        )}
        {!isLoading && notifications?.length === 0 && (
          <div className="text-center p-4 text-gray-500 font-mono font-bold">
            No Notifications🔕
          </div>
        )}
        {!isLoading &&
          notifications?.length > 0 &&
          notifications.map((notification) => (
            <div className="border-b border-b-gray-700" key={notification._id}>
              <div className="flex gap-2 items-center justify-between  p-4">
                <div className="flex gap-2">
                  {notification.type === "follow" && (
                    <FaUser className="w-7 h-7 text-primary" />
                  )}
                  {notification.type === "like" && (
                    <FaHeart className="w-7 h-7 text-red-500" />
                  )}

                  <Link to={`/profile/${notification.from.username}`}>
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img
                          src={
                            notification.from.profileImage ||
                            "/avatar-placeholder.png"
                          }
                          alt="profile-image"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold">
                        @{notification.from.username}
                      </span>
                      {notification.type === "follow"
                        ? "Followed you"
                        : "Liked your post"}
                    </div>
                  </Link>
                </div>
                <FaTrash className="w-5 h-5 cursor-pointer text-red-500" />
              </div>
            </div>
          ))}
        {/* content notifications end here */}
      </div>
    </>
  );
};

export default NotificationPage;
