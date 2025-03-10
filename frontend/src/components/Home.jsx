import React from 'react'
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar';
import useGetAllPost from '@/hooks/useGetAllPost';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';
import useGetStories from '@/hooks/useGetStories';
import Stories from './stories';

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  useGetStories();
  return (
    <div className='flex'>
      <div className="flex-grow max-w-2xl mx-auto">
        {/* ✅ Show Stories above Feed */}
        <Stories />
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home;