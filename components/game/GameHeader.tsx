import React, { useState, useEffect } from 'react';
import { Hexagon, Clock, Menu, X } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Player } from '@/types/Room';
import { User } from "@/types/User";
import GameActions from "@/components/game/GameActions";

interface GameHeaderProps {
    timeLeft: number;
    currentUser?: string;
    userObject?: User;
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
    handleCancelStartGame?: () => void;
    setStartTimer: (value: boolean) => void;
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
    startTimer: boolean,
    endsAt: number | null,
}

const GameHeader: React.FC<GameHeaderProps> = ({ timeLeft, currentUser, userObject, creator, handleStartGame, setIsEditingRoom, isEditingRoom, isGameRunning, timerVisible, setIsConsult, isConsult, handleJoinRoom, handleLeaveGame, players, gameStartingSoonTimer, handleCancelStartGame, setStartTimer, setTimeLeft, startTimer, endsAt }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    /*
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1 && startTimer) {
                    clearInterval(timer);

                    setStartTimer(false);
                    return 0;
                }
                return Math.max(prev - 1);
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);
*/
    useEffect(() => {
        if (!endsAt) return;

        let timer;
        const tick = () => {
            const remaining = Math.max(0, Math.floor(endsAt - Date.now() / 1000));
            console.log(`GameHeader: tick - remaining: ${remaining}`);
            setTimeLeft(remaining);
            if (remaining <= 0) {
                clearInterval(timer);
                setStartTimer(false);
            }
        };

        tick();
        timer = setInterval(tick, 1000);

        const onVisible = () => {
            if (document.visibilityState === "visible") tick();
        };
        document.addEventListener("visibilitychange", onVisible);

        return () => {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [endsAt, setTimeLeft, setStartTimer]);

    const actions = (variant: 'bar' | 'stack') => (
        <GameActions
            variant={variant}
            currentUser={currentUser}
            creator={creator}
            players={players}
            isGameRunning={isGameRunning}
            isStartingSoon={gameStartingSoonTimer !== undefined && gameStartingSoonTimer !== -1}
            onRules={() => setIsConsult(!isConsult)}
            onEdit={() => setIsEditingRoom(!isEditingRoom)}
            onStart={handleStartGame}
            onCancelStart={handleCancelStartGame}
            onJoin={handleJoinRoom}
            onLeave={handleLeaveGame}
            onAfterAction={variant === 'stack' ? () => setIsMobileMenuOpen(false) : undefined}
        />
    );

    const showTimer = isGameRunning && timerVisible && gameStartingSoonTimer === -1 && timeLeft >= 0;
    const urgent = timeLeft < 5;

    return (
        <header className="relative flex-none z-50 border-b border-white/10 bg-black/20 backdrop-blur-md shadow-lg pt-safe max-md:kb:pt-0">
            {/* Rangée à hauteur fixe : le centrage du timer ne dépend plus de la
                safe-area de l'encoche (elle est portée par le <header>). */}
            <div className="relative flex items-center justify-between gap-2 px-3 md:px-4 h-14 max-md:kb:h-10 md:h-16 transition-[height] duration-200">

                {/* LOGO KOVA */}
                <div className="flex items-center gap-2 md:gap-3 group cursor-pointer shrink-0 z-10">
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-purple-500 blur-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
                        <Hexagon className="w-7 h-7 max-md:kb:w-5 max-md:kb:h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white fill-white/10 relative z-10 stroke-[2.5]" />
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <span className="font-black text-[10px] md:text-xs text-purple-300">K</span>
                        </div>
                    </div>
                    <div className="flex flex-col" onClick={() => redirect('/')}>
                        <h1 className="font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-indigo-400 italic drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] text-xl max-md:kb:text-sm sm:text-2xl md:text-3xl" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                            KOVA
                        </h1>
                    </div>
                </div>

                {/* TIMER — centré sur la rangée, compact sur mobile.
                    `tabular-nums` fige la largeur des chiffres : la pastille ne
                    tressaute plus en passant de 10 à 9. */}
                {showTimer && (
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                        <div className={`flex items-center justify-center gap-1.5 md:gap-2 h-8 max-md:kb:h-7 md:h-9 px-2.5 md:px-3.5 min-w-[3.75rem] md:min-w-[4.5rem] rounded-full border transition-all duration-300 ${urgent ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-slate-800/40 border-slate-700'}`}>
                            <Clock className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 ${urgent ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
                            <span className={`font-mono tabular-nums font-bold leading-none text-base max-md:kb:text-sm md:text-xl ${urgent ? 'text-red-400' : 'text-cyan-400'}`}>
                                {timeLeft}
                            </span>
                        </div>
                    </div>
                )}

                {/* DROITE : actions (desktop), profil, et bouton menu (mobile) */}
                <div className="flex items-center gap-2 lg:gap-3 shrink-0 z-10">
                    <div className="hidden md:flex">{actions('bar')}</div>

                    <div className="hidden md:flex items-center gap-3 md:pl-1">
                        <div className="flex flex-col text-right">
                            <span className="text-xs font-bold text-white">{currentUser}</span>
                            {userObject?.stats?.level && (
                                <span
                                    className="text-[10px] text-purple-400 font-mono">Niveau {userObject?.stats?.level}
                                </span>
                            )}
                        </div>
                        {userObject?.imageUrl ? (
                            <img src={userObject?.imageUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-500 to-gray-700 ring-2 ring-white/20"></div>
                        )}
                    </div>

                    <button
                        className="md:hidden tap-target flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 rounded-full transition"
                        aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                        aria-expanded={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5 md:hidden shadow-2xl">

                    {/* User Info in Mobile Menu */}
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        {userObject?.imageUrl != '' ? (
                            <img src={userObject?.imageUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-500 to-gray-700 ring-2 ring-white/20"></div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">{currentUser || 'Invité'}</span>
                            <span className="text-xs text-purple-400 font-mono">Niveau {userObject?.stats?.level}</span>
                        </div>
                    </div>

                    {/* Game Actions */}
                    {actions('stack')}
                </div>
            )}

        </header >
    );
};

export default GameHeader;
