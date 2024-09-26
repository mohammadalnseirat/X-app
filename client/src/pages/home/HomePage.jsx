import React, { useState } from "react";
import CreatePost from "./CreatePost";
import Posts from "../../components/common/Posts";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");
  return (
    <div className="flex-[4_4_0] border-r mr-auto border-r-blue-400 min-h-screen">
      {/* Header Start here */}
      <div className="flex w-full border-b border-b-blue-400">
        <div
          onClick={() => setFeedType("forYou")}
          className="flex flex-1 font-mono font-semibold text-lg justify-center p-3 hover:bg-secondary transition duration-150 cursor-pointer relative"
        >
          For You
          {feedType === "forYou" && (
            <div className="absolute bottom-0  w-20 h-1 bg-primary rounded"></div>
          )}
        </div>
        
        <div
          onClick={() => setFeedType("following")}
          className="flex flex-1 font-mono text-lg font-bold justify-center p-3 hover:bg-secondary transition duration-150 cursor-pointer relative"
        >
          Following
          {feedType === "following" && (
            <div className="absolute bottom-0 w-20 h-1 bg-primary rounded"></div>
          )}
        </div>
      </div>
      {/* Header End here */}
      {/* create post start here */}
      <CreatePost />
      {/* create post end here */}
      {/* posts start here */}
      <Posts feedType={feedType} />
      {/* posts end here */}
    </div>
  );
};

export default HomePage;
