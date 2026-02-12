"use client";

import React, { useState } from 'react';
import AuthVisuals from '@/components/auth/AuthVisuals';
import AuthForm from '@/components/auth/AuthForm';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import Cookies from 'universal-cookie';

const AuthMockup = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle Login/Register
    const cookies = new Cookies();
    const [selectedAvatar, setSelectedAvatar] = useState('blue');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        avatar: selectedAvatar
    });

    const avatars = [
        { id: 'blue', gradient: 'from-blue-400 to-blue-600' },
        { id: 'red', gradient: 'from-red-400 to-red-600' },
        { id: 'green', gradient: 'from-green-400 to-green-600' },
        { id: 'purple', gradient: 'from-purple-400 to-purple-600' },
        { id: 'orange', gradient: 'from-orange-400 to-orange-600' },
    ];

    const handleSubmit = async () => {

        if (isLogin) {
            const base64encodedData = Buffer.from(`${formData.email}:${formData.password}`).toString('base64');
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${base64encodedData}`
                },
            });
            if (res.ok) {
                toast.success('Connexion reussie');
                cookies.set('email', formData.email);
                redirect('/');
            } else {
                toast.error('Une erreur est survenue');
            }
        } else {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                toast.success('Inscription reussie');
                cookies.set('email', formData.email);
                cookies.set('userName', formData.username);
                redirect('/');
            } else {
                toast.error('Une erreur est survenue. Veuillez vérifier vos informations.');
            }
        }

    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-purple-500 selection:text-white">

            {/* --- FOND ANIMÉ (Background FX) --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            {/* --- MAIN CARD --- */}
            <div className="w-full max-w-4xl bg-[#13131f]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
                <AuthVisuals
                    isLogin={isLogin}
                    username={formData.username}
                    selectedAvatar={selectedAvatar}
                    avatars={avatars}
                />
                <AuthForm
                    handleSubmit={handleSubmit}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                    formData={formData}
                    setFormData={setFormData}
                    selectedAvatar={selectedAvatar}
                    setSelectedAvatar={setSelectedAvatar}
                    avatars={avatars}
                />
            </div>

        </div>
    );
};

export default AuthMockup;