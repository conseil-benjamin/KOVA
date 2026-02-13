import React, { useState } from 'react';
import { Hexagon, Clock, Menu, X, Play, Settings, BookOpen, LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Player } from '@/types/Room';

interface GameHeaderProps {
    timeLeft: number;
    currentUser?: string;
    creator?: string;
    handleStartGame?: () => void;
    setIsEditingRoom: (value: boolean) => void;
    isEditingRoom?: boolean;
    isGameRunning?: boolean;
    timerVisible?: boolean;
    setIsConsult: (value: boolean) => void;
    isConsult?: boolean;
    handleJoinRoom?: () => void;
    handleLeaveGame?: () => void;
    players?: Player[];
    gameStartingSoonTimer?: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ timeLeft, currentUser, creator, handleStartGame, setIsEditingRoom, isEditingRoom, isGameRunning, timerVisible, setIsConsult, isConsult, handleJoinRoom, handleLeaveGame, players, gameStartingSoonTimer }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const userInGame = players?.find((player) => player.username.toLowerCase() === currentUser?.toLowerCase());

    return (
        <header className="relative flex-none border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between px-4 z-50 shadow-lg h-14 md:h-16 pt-2 md:pt-0">

            {/* LOGO KOVA */}
            <div className="flex items-center gap-2 md:gap-3 group cursor-pointer z-50">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
                    <Hexagon className="w-8 h-8 md:w-10 md:h-10 text-white fill-white/10 relative z-10 stroke-[2.5]" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <span className="font-black text-[10px] md:text-xs text-purple-300">K</span>
                    </div>
                </div>
                <div className="flex flex-col" onClick={() => redirect('/')}>
                    <h1 className="font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-indigo-400 italic drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] text-2xl md:text-3xl" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                        KOVA
                    </h1>
                </div>
            </div>

            {/* Info Manche & Timer - Centered */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 top-1/2 -translate-y-1/2 mt-1 z-40">
                {/* Desktop Menu */}
                <div className="hidden md:flex flex-col items-center">
                    {creator === currentUser && !isGameRunning && (
                        <div className='flex gap-2'>
                            <button className='px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition border border-white/10 text-sm font-medium' onClick={() => setIsEditingRoom(!isEditingRoom)}>Modifier</button>
                            {players && players.length > 0 && (
                                <button className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition shadow-[0_0_15px_rgba(168,85,247,0.4)] text-sm font-bold" onClick={handleStartGame}>Lancer</button>
                            )}
                            {!userInGame ? (
                                <button className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition shadow-[0_0_15px_rgba(168,85,247,0.4)] text-sm font-bold" onClick={handleJoinRoom}>Rejoindre</button>
                            ) : (
                                <button className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-500 transition shadow-[0_0_15px_rgba(239,68,68,0.4)] text-sm font-bold" onClick={handleLeaveGame}>Quitter</button>
                            )}
                        </div>
                    )}
                    {!isGameRunning && (
                        <div className='flex gap-2'>
                            <button className='px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition border border-white/10 text-sm font-medium' onClick={() => setIsConsult(!isConsult)}>Règles</button>
                        </div>
                    )}
                    {creator !== currentUser && (
                        <div className='flex gap-2'>
                            {!userInGame ? (
                                <button className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition shadow-[0_0_15px_rgba(168,85,247,0.4)] text-sm font-bold" onClick={handleJoinRoom}>Rejoindre</button>
                            ) : (
                                <button className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-500 transition shadow-[0_0_15px_rgba(239,68,68,0.4)] text-sm font-bold" onClick={handleLeaveGame}>Quitter</button>
                            )}
                        </div>
                    )}
                </div>

                {/* Timer Display */}
                {
                    (isGameRunning && timerVisible && gameStartingSoonTimer === 0 && timeLeft > 0) &&
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300 ${timeLeft < 5 ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-slate-800/40 border-slate-700'} `}>
                        <Clock className={`w-3 h-3 md:w-4 md:h-4 ${timeLeft < 5 ? 'text-red-400 animate-pulse' : 'text-cyan-400'} `} />
                        <span className={`font-mono font-nums ${timeLeft < 5 ? 'text-red-400' : 'text-cyan-400'} text-lg md:text-xl`}>
                            {timeLeft}
                        </span>
                    </div>
                }
            </div>

            {/* Right Side: User Profile & Mobile Menu Toggle */}
            <div className="flex items-center gap-3 z-50">
                <button
                    className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition relative z-50 property-safe"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                <div className="hidden md:flex items-center gap-3">
                    <div className="flex flex-col text-right">
                        <span className="text-xs font-bold text-white">{currentUser}</span>
                        <span className="text-[10px] text-purple-400 font-mono">Niveau 12</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 ring-2 ring-white/20"></div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-14 left-0 w-full bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5 md:hidden shadow-2xl">

                    {/* User Info in Mobile Menu */}
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 ring-2 ring-white/20"></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">{currentUser || 'Invité'}</span>
                            <span className="text-xs text-purple-400 font-mono">Niveau 12</span>
                        </div>
                    </div>

                    {/* Game Actions */}
                    <div className="flex flex-col gap-3">
                        {creator === currentUser && !isGameRunning && (
                            <>
                                <button
                                    className="flex items-center justify-center gap-2 p-3 w-full rounded-xl bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] active:scale-95 transition"
                                    onClick={() => { handleStartGame?.(); setIsMobileMenuOpen(false); }}
                                >
                                    <Play className="w-4 h-4 fill-current" /> Lancer la partie
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 p-3 w-full rounded-xl bg-slate-800 border border-white/10 text-white active:bg-slate-700 transition"
                                    onClick={() => { setIsEditingRoom(true); setIsMobileMenuOpen(false); }}
                                >
                                    <Settings className="w-4 h-4" /> Configurer la partie
                                </button>
                            </>
                        )}

                        {!isGameRunning && (
                            <button
                                className="flex items-center justify-center gap-2 p-3 w-full rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 active:bg-indigo-500/30 transition"
                                onClick={() => { handleJoinRoom?.(); setIsMobileMenuOpen(false); }}
                            >
                                <LogOut className="w-4 h-4" /> Rejoindre la partie
                            </button>
                        )}

                        {!isGameRunning && creator !== currentUser && (
                            <button
                                className="flex items-center justify-center gap-2 p-3 w-full rounded-xl bg-slate-800 border border-white/10 text-white active:bg-slate-700 transition"
                                onClick={() => { setIsConsult(true); setIsMobileMenuOpen(false); }}
                            >
                                <BookOpen className="w-4 h-4" /> Règles du jeu
                            </button>
                        )}

                        {handleLeaveGame && (
                            <button
                                className="flex items-center justify-center gap-2 p-3 w-full rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 active:bg-red-500/20 transition mt-2"
                                onClick={() => { handleLeaveGame(); setIsMobileMenuOpen(false); }}
                            >
                                <LogOut className="w-4 h-4" /> Quitter la partie
                            </button>
                        )}
                    </div>
                </div>
            )}

        </header >
    );
};

export default GameHeader;