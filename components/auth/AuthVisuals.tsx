"use client";

import React from 'react';
import { Zap, Gamepad2, Users } from 'lucide-react';

interface AuthVisualsProps {
    isLogin: boolean;
    username: string;
    selectedAvatar: string;
    avatars: { id: string, gradient: string }[];
}

export default function AuthVisuals({ isLogin, username, selectedAvatar, avatars }: AuthVisualsProps) {
    return (
        <div className="hidden md:flex w-2/5 bg-gradient-to-br from-[#1a1a24] to-[#0f0f18] p-8 flex-col justify-between relative overflow-hidden border-r border-white/5">

            {/* Logo */}
            <div className="flex items-center gap-2 z-10">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                    <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <h1 className="text-xl font-black tracking-tighter text-white italic">
                    POPSAUCE <span className="text-xs not-italic font-mono text-purple-400">MAX</span>
                </h1>
            </div>

            {/* Illustration Dynamique */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                {isLogin ? (
                    <>
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center animate-float">
                                <Gamepad2 className="w-16 h-16 text-slate-300 opacity-50" />
                            </div>
                            {/* Particules flottantes */}
                            <div className="absolute top-0 right-0 w-4 h-4 bg-purple-500 rounded-full blur-md animate-ping"></div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Bon retour !</h2>
                            <p className="text-sm text-slate-400">Prêt à dominer le classement ? Tes adversaires t'attendent.</p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Preview de l'avatar choisi */}
                        <div className="relative group">
                            <div className={`w-32 h-32 rounded-full bg-gradient-to-tr ${avatars.find(a => a.id === selectedAvatar)?.gradient || 'from-gray-700 to-gray-900'} shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-center text-4xl font-bold text-white ring-4 ring-[#13131f] transition-all duration-500`}>
                                {username ? username[0].toUpperCase() : '?'}
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#13131f] px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-purple-400 shadow-lg">
                                NIVEAU 1
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Rejoins l'arène</h2>
                            <p className="text-sm text-slate-400">Crée ton profil, personnalise ton avatar et commence ton ascension.</p>
                        </div>
                    </>
                )}
            </div>

            {/* Footer Left */}
            <div className="z-10 text-[10px] text-slate-500 text-center">
                © 2024 PopSauce Max. Tous droits réservés.
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
    );
}
