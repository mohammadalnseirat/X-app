import React from "react";
import RightPanelSkeleton from "../skeleton/RigntPanelSkeleton";
import { Link } from "react-router-dom";
import { TbPointFilled } from "react-icons/tb";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import { toast } from "react-hot-toast";

const RigntPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/users/suggestion");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        if (res.ok) {
          return data;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  // get the custom hook:
  const { followUser, isPending } = useFollow();

  // check if there is no user in data base:
  if (suggestedUsers?.length === 0) {
    return <div className="w-0 md:w-64"></div>;
  }
  return (
    <div className="hidden lg:block  mx-2">
      <div className="sticky top-2 bg-[#16181C] p-4 border border-[#1DA1F2] shadow-sm rounded-lg ">
        <p className="capitalize font-bold text-gray-400 font-mono text-lg flex items-center gap-1">
          <TbPointFilled className="text-[#1DA1F2] text-lg" />
          Who to follow:{" "}
        </p>
        <div className="flex flex-col mt-2 gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex  items-center border-b py-1 border-b-[#1DA1F2] justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  {/* image start here */}
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={user.profileImage || "/avatar-placeholder.png"}
                        alt="profile-image"
                      />
                    </div>
                  </div>
                  {/* image end here */}
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-gray-400">
                      {user.username}
                    </span>
                  </div>
                </div>
                {/* button start here */}
                <div>
                  <button
                    className={`btn bg-[#1DA1F2] btn-sm font-medium  rounded-xl hover:rounded-full hover:opacity-90 text-white ${
                      isPending ? "bg-base-100" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success("Followed successfully!");
                      followUser(user._id);
                    }}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-infinity loading-md text-sky-500"></span>
                      </>
                    ) : (
                      "Follow"
                    )}
                  </button>
                </div>
                {/* button end here */}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RigntPanel;
