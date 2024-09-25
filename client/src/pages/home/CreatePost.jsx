import React, { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";

const CreatePost = () => {
  const data = {
    profileImage: "/avatars/boy1.png",
  };
  const [img, setImg] = useState(null);
  const [text, setText] = useState("");
  const imgRef = useRef();
  const isPending = false;
  const isError = false;
  return (
    <div className="flex items-start gap-4 p-4 border-b border-b-[#1DA1F2]">
      {/* avatar start here */}
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img
            src={data?.profileImage || "/avatar-placeholder.png"}
            alt="profile-Image"
          />
        </div>
      </div>
      {/* avatar end here */}
      {/* form start here */}
      <form className="flex flex-col gap-2 w-full">
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
                setImg(null), imgRef.current.value;
              }}
              className="absolute right-0 top-0 cursor-pointer text-white bg-gray-800 rounded w-5 h-5 "
            />
            <img
              src={img}
              alt="image-create-post"
              className="w-full object-contain h-72 mx-auto rounded"
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
          <input type="file" hidden ref={imgRef} accept="image/*" />
          <button className="btn btn-primary btn-md rounded px-4  text-white">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && (
          <p className="text-red-500 font-semibold text-center">
            Something went wrong
          </p>
        )}
      </form>
      {/* form end here */}
    </div>
  );
};

export default CreatePost;
