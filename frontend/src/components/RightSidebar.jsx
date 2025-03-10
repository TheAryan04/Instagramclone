import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const {user} = useSelector(store=>store.auth);
  const profilePic = user?.profilePic || user?.author?.[0]?.profilePic;
  console.log("Profile Pic URL:", profilePic);
  return (
    <div className='w-fit my-10 pr-32'>
      <div className="flex flex-row items-center justify-start">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={profilePic} alt="post_image" />
            <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here....'}</span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  )
}

export default RightSidebar;