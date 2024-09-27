import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
  FaTrash,
} from "react-icons/fa";
import { VscDebugBreakpointData } from "react-icons/vsc";
import { BsSendFill } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const isLiked = post.likes.includes(authUser?._id);
  const isMyPost = authUser._id === post.user._id;
  const postOwner = post.user;
  const formatedDate = formatPostDate(post.createdAt);

  // Add useQuery from react-query:

  const queryClient = useQueryClient();

  // Add useMutation from react-query:
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        // create a resposne:
        const res = await fetch(`/api/v1/posts/deletepost/${post._id}`, {
          method: "DELETE",
        });

        // convert data to json:
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
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      // refetch the data to update the dom:
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // useMutation to add a comment:
  const {
    mutate: addCommentOnPost,
    error,
    isPending: isCommenting,
    isError: isCommentError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/v1/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to add comment");
        }
        if (res.ok) {
          return data;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (updatedCommentss) => {
      toast.success("Comment added successfully!");
      setComment("");
      // refetch the data to update the dom BCZ that is not the best way for UX:
      // queryClient.invalidateQueries({ queryKey: ["posts"] });

      // instead we will update the cach directly that is the best for the UX:
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, comments: updatedCommentss };
          }
          return p;
        });
      });
    },
    //   onError: (error) => {
    //     toast.error(error.message);
    //   },
  });
  // handle comment:
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (isCommenting) {
      return;
    }
    addCommentOnPost();
  };

  // handle delete post:
  const handleDeletePost = () => {
    deletePost();
  };

  // Like and Unlike Post using react-query:
  const { mutate: likeUnLikePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/v1/posts/like/${post._id}`, {
          method: "POST",
        });
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
    onSuccess: (updatedLikes) => {
      // that is not the best BCZ will refetch all the posts and update the dom not good for UX:
      // queryClient.invalidateQueries({queryKey:["posts"]})

      // instead we will update the cach directly that is the best for the UX:
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  // handle like post:
  const handleLikePost = () => {
    if (isLiking) {
      return;
    }
    likeUnLikePost();
  };
  return (
    <div className="flex gap-2 items-start p-4 border-b border-b-gray-500">
      {/* image start here */}
      <div className="avatar">
        <Link
          to={`/profile/${postOwner.username}`}
          className="w-8 rounded-full overflow-hidden"
        >
          <img
            src={postOwner.profileImage || "/avatar-placeholder.png"}
            alt="profile-image-owner"
          />
        </Link>
      </div>
      {/* image end here */}
      {/* username && fullName && delete && formatedDate start here */}

      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${postOwner.username}`} className="font-bold">
            {postOwner.fullName}
          </Link>
          <span className="felx gap-1 text-gray-600 text-sm">
            <Link to={`/profile/${postOwner.username}`}>
              @{postOwner.username}
            </Link>
            <span>.</span>
            <span>{formatedDate}</span>
          </span>
          {isMyPost && (
            <span className="flex justify-end flex-1">
              {!isDeleting && (
                <FaTrash
                  onClick={handleDeletePost}
                  className="cursor-pointer text-red-600"
                />
              )}
              {isDeleting && (
                <>
                  <span className="loading loading-spinner loading-sm text-red-500"></span>
                </>
              )}
            </span>
          )}
        </div>
        {/* username && fullName && delete && formatedDate end here */}
        {/* title && image start here */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <span className="text-[#1DA1F2] opacity-90 capitalize">
            {post.text}
          </span>
          {post.img && (
            <img
              src={post.img}
              alt="post-image"
              className="h-80 object-cover rounded-lg border border-blue-500"
            />
          )}
        </div>
        {/* title && image end here */}
        {/* like && comment start here */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-4 justify-between w-2/3">
            {/* comment start here */}
            <div
              className="group flex items-center gap-1 cursor-pointer"
              onClick={() =>
                document.getElementById("comments_modal" + post._id).showModal()
              }
            >
              <FaRegComment className="w-5 h-5 text-gray-400 group-hover:text-sky-500" />
              <span className="text-gray-400 text-[16px] font-semibold group-hover:text-sky-500">
                {post.comments.length}
              </span>
            </div>
            {/* we are using Dialog from daisyui */}
            <dialog
              id={"comments_modal" + post._id}
              className="modal border-none outline-none"
            >
              <div className="modal-box w-96  rounded border border-sky-600">
                <h3 className="font-bold font-mono text-lg text-gray-300 uppercase mb-4 flex items-center gap-1">
                  <VscDebugBreakpointData className="w-4 h-4 text-[#1DA1F2]" />
                  Comments:
                </h3>
                <div className="flex flex-col gap-3 overflow-auto  max-h-60 w-full">
                  {post.comments.length === 0 && (
                    <p className="text-gray-400 text-sm">
                      No comments yet 📝 Be the first one 😉
                    </p>
                  )}
                  {post.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="flex gap-2 items-start w-full mx-auto"
                    >
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              comment.user.profileImage ||
                              "/avatar-placeholder.png"
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center">
                          <span className="font-bold">
                            {comment.user.fullName}
                          </span>
                          <span className="text-gray-400 text-sm">
                            @{comment.user.username}
                          </span>
                        </div>
                        <p className="text-sm font-mono font-medium text-gray-300">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={handleSubmitComment}
                  className="flex items-center justify-start gap-2 mt-4 border-t border-t-[#1DA1F2]"
                >
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 mt-4 w-96 rounded textarea text-md resize-none border border-sky-500 focus:outline-[#1DA1F2] "
                    placeholder="Add your comment..."
                  />
                  <button
                    className={`btn bg-sky-600  btn-sm rounded-full px-4 mt-4 text-white ${
                      isCommenting ? "bg-base-100" : ""
                    }`}
                  >
                    {isCommenting ? (
                      <span className="loading loading-infinity loading-md text-sky-500"></span>
                    ) : (
                      <>
                        <BsSendFill />
                      </>
                    )}
                  </button>
                </form>
                {isCommentError && (
                  <p className="text-red-500 text-sm font-semibold text-center mt-2">
                    {error.message}
                  </p>
                )}
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">close</button>
              </form>
            </dialog>
            {/* comment end here */}
            {/* Re post start here */}
            <div className="flex items-center gap-1 group cursor-pointer">
              <BiRepost className="w-6 h-6 text-gray-400 group-hover:text-sky-500" />
              <span className="w-5 h-5 text-gray-400 group-hover:text-sky-500">
                0
              </span>
            </div>
            {/* Re post end here */}
            {/* like start here */}
            <div
              onClick={handleLikePost}
              className="flex items-center gap-1 cursor-pointer group"
            >
              {isLiking && (
                <>
                  <span className="loading loading-infinity loading-md text-red-500"></span>
                </>
              )}
              {!isLiked && !isLiking && (
                <FaRegHeart className="w-5 h-5 cursor-pointer text-gray-400 group-hover:text-red-500" />
              )}
              {isLiked && !isLiking && (
                <FaRegHeart className="w-5 h-5 cursor-pointer text-red-500 group-hover:text-red-500" />
              )}
              <span
                className={`text-sm  group-hover:text-red-500 ${
                  isLiked ? "text-red-500" : "text-gray-400 "
                }`}
              >
                {post.likes.length}
              </span>
            </div>
            {/* like end here */}
          </div>
          <div className="flex  items-center">
            <FaRegBookmark className="w-5 h-5 cursor-pointer text-gray-400 group-hover:text-sky-500" />
          </div>
        </div>
        {/* like && comment end here */}
      </div>
    </div>
  );
};

export default Post;
