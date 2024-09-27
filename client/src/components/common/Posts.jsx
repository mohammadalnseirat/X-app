import React, { useEffect } from "react";
import PostSkeleton from "../skeleton/PostSkeleton";
import Post from "./Post";
import { useQuery } from "@tanstack/react-query";

const Posts = ({ feedType, username, userId }) => {
  // Function to get the end point:
  const getPostEndPoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/v1/posts/all";
      case "following":
        return "/api/v1/posts/following";
      case "posts":
        return `/api/v1/posts/userPosts/${username}`;
      case "likes":
        return `/api/v1/posts/likes/${userId}`;
      default:
        return "/api/v1/posts/all";
    }
  };
  // onClick={() => setFeedType("following")}
  //

  const END_POINT_POST = getPostEndPoint();

  // useQuery to get the data:
  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        // create a response:
        const res = await fetch(END_POINT_POST);
        // convert the data to json:
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch posts!");
        }
        if (res.ok) {
          return data;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  // useEffect to fetch the data when changed the tab:
  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);
  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {(!isLoading || !isRefetching) && posts?.length === 0 && (
        <p className="text-center my-5 text-red-500 font-semibold italic font-mono text-lg underline underline-offset-4">
          No posts in this tab. Switch 👻
        </p>
      )}
      {(!isLoading || !isRefetching) && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
