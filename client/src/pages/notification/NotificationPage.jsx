import React from "react";
import { VscDebugBreakpointData } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import { FaHeart, FaTrash, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  // function to get the notifications using react-query:
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/notifications");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch notifications");
        }
        if (res.ok) {
          return data;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  // function to delete all notifications with useMutation:
  const { mutate: deleteAllNotifications, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/v1/notifications/deleteall", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to delete all notifications");
        }
        if (res.ok) {
          return data;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("All Notifications Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="flex-[4_4_0] border-r border-[#1DA1F2]  min-h-screen">
        {/* Header Start here */}
        <div className="flex items-center justify-between p-4 border-b border-b-gray-700">
          <p className="font-mono font-bold  flex items-center gap-1">
            <VscDebugBreakpointData className="text-md text-[#1DA1F2]" />
            Notifications:
          </p>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-6 h-6 hover:text-[#1DA1F2]" />
            </div>
            {notifications?.length > 0 && (
              <ul
                tabIndex={0}
                className="dropdown-content menu z-[1] p-2 shadow-sm bg-base-100 rounded-box w-52"
              >
                <li className="text-red-500 font-semibold  hover:bg-red-500 hover:text-gray-50">
                  <a onClick={deleteAllNotifications}>
                    Delete All Notifications
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
        {/* Header End here */}
        {/* content notifications start here */}
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <span className="loading loading-infinity loading-lg text-sky-500"></span>
          </div>
        )}
        {!isLoading && notifications?.length === 0 && (
          <div className="text-center p-4 text-indigo-600 text-lg font-mono font-bold">
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
              </div>
            </div>
          ))}
        {/* content notifications end here */}
      </div>
    </>
  );
};

export default NotificationPage;
