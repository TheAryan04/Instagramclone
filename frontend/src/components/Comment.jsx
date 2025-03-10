import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Comment = ({comment}) => {
  return (
    <div>
        <div className="my-2 flex gap-1 items-center">
            <Avatar>
                <AvatarImage src={comment?.author?.profilePic} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className='font-bold text-sm'>{comment?.author?.[0]?.username} <span className='font-normal pl-0.5'>{comment?.text}</span></h1>
        </div>
    </div>
  )
}

export default Comment;