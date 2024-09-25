import React from 'react'
import PostSkeleton from '../skeleton/PostSkeleton'
import { POSTS } from '../../utils/db/dummy'
import Post from './Post'

const Posts = () => {
  const loading = false
  return (
    <>
      {loading && (
        <div className='flex flex-col justify-center'>
        <PostSkeleton/>
        <PostSkeleton/>
        <PostSkeleton/>
        </div>
      )}
      {!loading && POSTS?.length === 0 && (
        <p className="text-center my-5 text-gray-200 underline underline-offset-2">No posts in this tab. Switch 👻</p>
      )}
      {!loading && POSTS?.length > 0 && (
        <div>
          {POSTS.map((post)=>(
            <Post key={post._id} post={post}/>
          ))}
        </div>
      )}
      <div>

      </div>
    </>
  )
}

export default Posts