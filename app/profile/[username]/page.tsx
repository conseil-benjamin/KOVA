"use client";

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import Navbar from '@/components/home/Navbar';
import Cookies from 'universal-cookie';
import { toast } from 'sonner';
import { User } from '@/types/User';
import LoadingPage from '@/components/loadingPage';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsGrid from '@/components/profile/StatsGrid';

// We define the props as recommended for next > 15
type Params = Promise<{ username: string }>;

export default function ProfilePage({ params }: { params: Params }) {
    const { username } = use(params);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Default empty rooms so Navbar doesn't crash if it expects it
    const rooms: any[] = [];

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const cookies = new Cookies();
                const email = cookies.get('email');
                const loggedInUserFromCookie = cookies.get('user');

                if (email && loggedInUserFromCookie) {
                    setIsLoggedIn(true);
                    setCurrentUser(loggedInUserFromCookie);
                } else {
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                }

                // Fetch the profile target user
                // Adjust endpoint if your backend uses a different path to fetch by username
                const res = await fetch(`/api/users/username/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    const userData = await res.json();
                    // Provide default missing stats locally for testing if db isn't updated yet
                    const enhancedUserData: User = {
                        ...userData,
                        stats: {
                            ...userData.stats,
                            xpToNextLevel: userData.stats.xpToNextLevel || 400,
                            gamesPodium: userData.stats.gamesPodium || 0,
                            winsStreak: userData.stats.winsStreak || 0,
                            bestResponseTime: userData.stats.bestResponseTime || 0,
                            bestWinsStreak: userData.stats.bestWinsStreak || 0,
                            totalPlayTime: userData.stats.totalPlayTime || 0,
                        }
                    };
                    setProfileUser(enhancedUserData);
                } else {
                    toast.error('Utilisateur non trouvé');
                }

            } catch (error) {
                console.error("Erreur connexion API:", error);
                toast.error('Erreur lors du chargement du profil');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [username]);

    const isOwner = React.useMemo(() => {
        if (!currentUser || !profileUser) return false;
        return currentUser.username.toLowerCase() === profileUser.username.toLowerCase();
    }, [currentUser, profileUser]);

    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center h-[100dvh] bg-[#0a0a0f] w-full">
                    <LoadingPage />
                </div>
            ) : (
                <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans selection:bg-purple-500 selection:text-white pb-20 md:pb-0">
                    <Navbar isLoggedIn={isLoggedIn} user={currentUser} rooms={rooms} />

                    <div className="pt-28 px-4 md:px-8 max-w-[1200px] mx-auto pb-12">
                        {profileUser ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <ProfileHeader user={profileUser} isOwner={isOwner} />
                                <StatsGrid stats={profileUser.stats} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                                <div className="text-9xl mb-4">👻</div>
                                <h1 className="text-3xl font-black text-white mb-2">Profil Introuvable</h1>
                                <p className="text-slate-400">Ce joueur n&apos;existe pas ou a disparu dans le néant.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
