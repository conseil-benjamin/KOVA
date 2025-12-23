"use client";

import React, { useState } from 'react';
import Navbar from '@/components/home/Navbar';
import SidebarLeft from '@/components/home/SidebarLeft';
import RoomBrowser from '@/components/home/RoomBrowser';
import SidebarRight from '@/components/home/SidebarRight';
import MobileFab from '@/components/home/MobileFab';

const HomeMockup = () => {
  // --- ÉTAT ---
  const [activeTab, setActiveTab] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans selection:bg-purple-500 selection:text-white pb-20 md:pb-0">

      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {/* --- CONTENT LAYOUT --- */}
      <div className="pt-24 px-4 md:px-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        <SidebarLeft isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <RoomBrowser
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <SidebarRight />

      </div>

      <MobileFab />

    </div>
  );
};

export default HomeMockup;