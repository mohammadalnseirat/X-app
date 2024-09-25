import React from "react";
import RightPanelSkeleton from "../skeleton/RigntPanelSkeleton";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import { Link } from "react-router-dom";
import { TbPointFilled } from "react-icons/tb";

const RigntPanel = () => {
  const loading = false;
  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="sticky top-2 bg-[#16181C] p-4 border border-[#1DA1F2] shadow-sm rounded-lg ">
        <p className="capitalize font-bold text-gray-400 font-mono text-lg flex items-center gap-1">
          <TbPointFilled className="text-[#1DA1F2] text-lg" />
          Who to follow:{" "}
        </p>
        <div className="flex flex-col mt-2 gap-4">
          {/* item */}
          {loading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!loading &&
            USERS_FOR_RIGHT_PANEL?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex  items-center border-b py-1 border-b-[#1DA1F2] justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  {/* image start here */}
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImage} alt="profile-image" />
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
                  <button className="btm bg-[#1DA1F2] btn-sm font-medium  rounded-xl hover:rounded-full hover:opacity-90 text-white  ">
                    Follow
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
