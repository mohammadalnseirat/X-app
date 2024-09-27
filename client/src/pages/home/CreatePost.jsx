import React, { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
const CreatePost = () => {
  const [img, setImg] = useState(null);
  const [text, setText] = useState("");
  const imgRef = useRef();
  // get the authenticated user:
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  // Add useMutation from react-query:
  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        // create a response:
        const res = await fetch("/api/v1/posts/createpost", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
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
      setText("");
      setImg(null);
      toast.success("Post created successfully!");
      // refetch the data to update the dom:
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // create a function to handle submit:
  const handleSubmitCreatePost = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };
  // handle image change:
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="flex items-start gap-4 p-4 border-b border-b-[#1DA1F2]">
      {/* avatar start here */}
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img
            src={authUser?.profileImage || "/avatar-placeholder.png"}
            alt="profile-Image"
          />
        </div>
      </div>
      {/* avatar end here */}
      {/* form start here */}
      <form
        onSubmit={handleSubmitCreatePost}
        className="flex flex-col gap-2 w-full"
      >
        <textarea
          className="textarea border border-[#1DA1F2] w-full resize-none rounded-lg p-3 focus:outline focus:outline-[#1DA1F2]"
          placeholder="What's happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {/* image start here */}
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
              className="absolute right-0 top-4 cursor-pointer text-white bg-red-500 rounded w-5 h-5 "
            />
            <img
              src={img}
              alt="image-create-post"
              className="w-full  object-contain h-72 mx-auto rounded"
            />
          </div>
        )}

        {/* image end here */}
        <div className="flex items-center justify-between border-t border-t-gray-700 py-2">
          <div className="flex items-center gap-4">
            <CiImageOn
              onClick={() => imgRef.current.click()}
              className="w-6 h-6 cursor-pointer fill-primary"
            />
            <BsEmojiSmileFill className="w-5 h-5 cursor-pointer fill-primary" />
          </div>
          <input
            onChange={handleImageChange}
            type="file"
            hidden
            ref={imgRef}
            accept="image/*"
          />
          <button
            className={`btn btn-primary btn-md rounded px-4 py-2  text-white ${
              isPending ? "rounded-full bg-base-100" : ""
            }`}
          >
            {isPending ? (
              <>
                <span className="loading loading-infinity text-sky-500 loading-sm"></span>
              </>
            ) : (
              "Post"
            )}
          </button>
        </div>
        {/* second way to show the error */}
        {/* {isError && (
          <p className="text-red-500 font-semibold text-center">
            Something went wrong
          </p>
        )} */}
      </form>
      {/* form end here */}
    </div>
  );
};

export default CreatePost;
