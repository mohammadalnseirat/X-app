import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProfileHeaderSkeleton from "../../components/skeleton/ProfileHeaderSkeleton";
import { FaArrowLeft, FaEdit, FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { POSTS } from "../../utils/db/dummy";
import Posts from "../../components/common/Posts";
import EditProfileModal from "./EditProfileModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";
import useFollow from "../../hooks/useFollow";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [feedType, setFeedType] = useState("posts");
  // state for image:
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const coverImageRef = useRef();
  const profileImageRef = useRef();

  const { username } = useParams();
  const queryClient = useQueryClient();

  // get the auth user:
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // useQuery to fetch the data:
  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/v1/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch user");
        }
        if (res.ok) {
          return data;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  // Custom hook to call function:
  const { followUser, isPending } = useFollow();
  const isMyProfile = authUser._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const amIFollowing = authUser?.following.includes(user?._id);

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
  // useEffect to refetch the data:
  useEffect(() => {
    refetch();
  }, [username, refetch]);

  // UseMutation to update the profile image and cover image:
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/v1/users/updateprofile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ coverImage, profileImage }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to update profile image");
        }
        if (res.ok) {
          return data;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success(" updated successfully"),
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["authUser"] }),
          queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
        ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex-[4_4_0] border-r border-r-[#1DA1F2] min-h-screen">
      {/* Header Start Here */}
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
      {!isLoading && !isRefetching && !user && (
        <p className="text-center mt-4 text-lg uppercase text-gray-300">
          404 | User not found!
        </p>
      )}
      <div className="flex flex-col">
        {!isLoading && !isRefetching && user && (
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
              {isMyProfile && <EditProfileModal authUser={authUser}/>}
              {!isMyProfile && (
                <button
                  onClick={() => {
                    followUser(user?._id),
                      amIFollowing
                        ? toast.success("UnFollowed successfully!")
                        : toast.success("Followed successfully!");
                  }}
                  className="btn capitalize btn-sm btn-outline rounded-full"
                >
                  {isPending && (
                    <span className="loading  loading-dots  text-sky-500 loading-md"></span>
                  )}
                  {!isPending && amIFollowing && "Unfollow"}

                  {!isPending && !amIFollowing && "Follow"}
                </button>
              )}
              {(coverImage || profileImage) && (
                <button
                  className={`btn btn-primary rounded-full btn-sm text-white px-4 ml-2 ${
                    isUpdatingProfile ? "bg-base-100" : ""
                  }`}
                  onClick={() => updateProfile()}
                >
                  {isUpdatingProfile ? (
                    <span className="loading  loading-infinity  text-sky-500 loading-md"></span>
                  ) : (
                    "Update"
                  )}
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
                        href={user?.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-md text-[#1DA1F2] underline underline-offset-2"
                      >
                        {user?.link}
                      </a>
                    </>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <IoCalendarOutline className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {memberSinceDate}
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
        <Posts username={username} feedType={feedType} userId={user?._id} />
      </div>
      {/* Header End Here */}
    </div>
  );
};

export default ProfilePage;
