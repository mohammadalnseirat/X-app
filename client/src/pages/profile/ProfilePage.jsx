import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProfileHeaderSkeleton from "../../components/skeleton/ProfileHeaderSkeleton";
import { FaArrowLeft, FaEdit, FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { POSTS } from "../../utils/db/dummy";
import Posts from "../../components/common/Posts";
import EditProfileModal from "./EditProfileModal";

const ProfilePage = () => {
  const [feedType, setFeedType] = useState("posts");
  // state for image:
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const coverImageRef = useRef();
  const profileImageRef = useRef();
  const isLoading = false;
  const isMyProfile = true;
  const user = {
    _id: "1",
    fullName: "John Doe",
    username: "johndoe",
    profileImage: "/avatars/boy2.png",
    coverImage: "/cover.png",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    link: "https://youtube.com/@asaprogrammer_",
    following: ["1", "2", "3"],
    followers: ["1", "2", "3"],
  };

  // handle Image Change:
  const handleImageChange = (e, state) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImage" && setCoverImage(reader.result);
        state === "profileImage" && setProfileImage(reader.result);
      };
      reader.readAsDataURL(imageFile);
    }
  };
  return (
    <div className="flex-[4_4_0] border-r border-r-[#1DA1F2] min-h-screen">
      {/* Header Start Here */}
      {isLoading && <ProfileHeaderSkeleton />}
      {!isLoading && !user && (
        <p className="text-center mt-4 text-lg uppercase text-gray-300">
          404 | User not found!
        </p>
      )}
      <div className="flex flex-col">
        {!isLoading && user && (
          <>
            <div className="flex gap-10 px-4 py-2 items-center">
              <Link to="/">
                <FaArrowLeft className="w-5 h-5 hover:text-[#1DA1F2]" />
              </Link>
              <div className="flex items-center gap-2">
                <p className="font-bold font-mono text-lg cursor-pointer text-gray-300 underline underline-offset-2">
                  {user?.fullName}
                </p>
                <span className="text-md font-bold px-3 py-[2px] border hover:bg-sky-400 cursor-pointer hover:text-white border-sky-400  rounded-full text-center text-sky-400">
                  {POSTS?.length}
                </span>
              </div>
            </div>
            {/* Cover Image Start Here */}
            <div className="relative group/cover">
              <img
                src={coverImage || user?.coverImage || "/cover.png"}
                alt="cover-image"
                className="object-cover h-52 w-full "
              />
              {isMyProfile && (
                <div
                  className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-70 cursor-pointer"
                  onClick={() => coverImageRef.current.click()}
                >
                  <FaEdit className="w-5 h-5 text-gray-50  hover:text-[#1DA1F2] ml-2" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                ref={coverImageRef}
                onChange={(e) => handleImageChange(e, "coverImage")}
              />
              {/* Cover Image End Here */}
              {/* User Profile Image Start Here */}
              <input
                type="file"
                ref={profileImageRef}
                accept="image/*"
                hidden
                onChange={(e) => handleImageChange(e, "profileImage")}
              />
              <div className="avatar absolute -bottom-16 left-4">
                <div className="w-32 h-32 rounded-full relative group/avatar ">
                  <img
                    src={
                      profileImage ||
                      user?.profileImage ||
                      "/avatar-placeholder.png"
                    }
                    alt="profile-image"
                  />
                  {isMyProfile && (
                    <div
                      className="absolute top-5 right-3 p-1 bg-base-100 bg-opacity-80  rounded-full cursor-pointer"
                      onClick={() => profileImageRef.current.click()}
                    >
                      <MdEdit className="w-5 h-5 text-gray-50 hover:text-[#1DA1F2]" />
                    </div>
                  )}
                </div>
              </div>
              {/* User Profile Image End Here */}
            </div>
            <div className="flex justify-end mt-5 px-4">
              {isMyProfile && <EditProfileModal />}
              {!isMyProfile && (
                <button
                  onClick={() => alert("Followed Successfully!")}
                  className="btn capitalize btn-sm btn-outline rounded-full"
                >
                  Follow
                </button>
              )}
              {(coverImage || profileImage) && (
                <button
                  className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                  onClick={() => alert("Profile updated successfully")}
                >
                  Update
                </button>
              )}
            </div>

            {/* Profile Details Start Here */}
            <div className="flex flex-col gap-4 mt-14 px-4">
              <div className="flex flex-col">
                <span className="text-lg font-bold">{user?.fullName}</span>
                <span className="text-sm text-gray-400">@{user?.username}</span>
                <span className="text-sm my-1">{user?.bio}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user?.link && (
                  <div className="flex items-center gap-2">
                    <>
                      <FaLink className="w-4 h-4 text-gray-500" />
                      <a
                        href="https://youtube.com/@asaprogrammer_"
                        target="_blank"
                        rel="noreferrer"
                        className="text-md text-[#1DA1F2] underline underline-offset-2"
                      >
                        youtube.com/@asaprogrammer_
                      </a>
                    </>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <IoCalendarOutline className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    Joined July 2021
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1 items-center">
                  <span className="text-sm font-bold">
                    {user?.following.length}
                  </span>
                  <span className="text-sm font-bold text-gray-500">
                    Following
                  </span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="text-sm font-bold">
                    {user?.followers.length}
                  </span>
                  <span className="text-sm font-bold text-gray-500">
                    Followers
                  </span>
                </div>
              </div>
            </div>
            {/* Profile Details End Here */}
            <div className="flex w-full border-b border-b-[#1DA1F2] mt-5">
              <div
                onClick={() => setFeedType("posts")}
                className="flex justify-center flex-1 p-3 hover:bg-secondary relative transition-all duration-150 cursor-pointer"
              >
                Posts
                {feedType === "posts" && (
                  <div className="absolute bottom-0 w-20 h-1 bg-primary rounded"></div>
                )}
              </div>
              <div
                onClick={() => setFeedType("likes")}
                className="flex justify-center flex-1 p-3 rounded hover:bg-secondary relative cursor-pointer transition-all duration-150"
              >
                Likes
                {feedType === "likes" && (
                  <div className="absolute bottom-0 w-20 h-1 bg-primary rounded"></div>
                )}
              </div>
            </div>
          </>
        )}
        <Posts />
      </div>
      {/* Header End Here */}
    </div>
  );
};

export default ProfilePage;
