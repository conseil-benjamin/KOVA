"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/home/Navbar';
import SidebarLeft from '@/components/home/SidebarLeft';
import RoomBrowser from '@/components/home/RoomBrowser';
import SidebarRight from '@/components/home/SidebarRight';
import MobileFab from '@/components/home/MobileFab';
import Cookies from 'universal-cookie';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { User } from '@/types/User';
import { Loader2Icon } from 'lucide-react';
import LoadingPage from '@/components/loadingPage';
import { Room } from '@/types/Room';

const HomeMockup = () => {
  // --- ÉTAT ---
  const [activeTab, setActiveTab] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const cookies = new Cookies();
    const email = cookies.get('email');
    if (email) {
      setIsLoggedIn(true);

      const fetchUser = async () => {
        try {
          const res = await fetch(`http://localhost:3333/users/${email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setLoading(false);

          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            cookies.set('user', JSON.stringify(userData));
            cookies.set('userName', userData.username);
            cookies.set('userAvatar', userData.avatar);
            toast.success(`Heros ${userData.username} chargé !`);
          } else {
            console.error('Erreur fetch user');
            toast.error('Impossible de charger le profil');
          }
        } catch (error) {
          console.error("Erreur connexion API:", error);
        }
      };

      // const fetchDonneesSite 

      fetchUser();
    }
    else {
      setIsLoggedIn(false);
    }

    const fetchPublicRooms = async () => {
      try {
        const res = await fetch(`http://localhost:3333/rooms`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setLoading(false);

        if (res.ok) {
          const roomsData = await res.json();
          setRooms(roomsData);
        } else {
          toast.error('Impossible de charger les rooms');
        }
      } catch (error) {
        console.error("Erreur connexion API:", error);
      }
    }
    fetchPublicRooms();
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans selection:bg-purple-500 selection:text-white pb-20 md:pb-0">

          <Navbar isLoggedIn={isLoggedIn} user={user} />

          {/* --- CONTENT LAYOUT --- */}
          <div className="pt-24 px-4 md:px-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

            <SidebarLeft isLoggedIn={isLoggedIn} user={user} />

            <RoomBrowser
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              viewMode={viewMode}
              setViewMode={setViewMode}
              rooms={rooms}
            />

            <SidebarRight />

          </div>

          <MobileFab />

        </div>
      )}
    </>
  );
};

export default HomeMockup;