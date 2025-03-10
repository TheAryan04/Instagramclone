import React from 'react'
import Post from './post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts} = useSelector(store => store.post);
  return (
    <div>
        {
            posts.map((items) => <Post key={items._id} post={items}/>)
        }
    </div>
  )
}

export default Posts