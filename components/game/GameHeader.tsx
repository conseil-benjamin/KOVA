import React from 'react';
import { Hexagon, Clock, Menu } from 'lucide-react';

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
}

const GameHeader: React.FC<GameHeaderProps> = ({ timeLeft, currentUser, creator, handleStartGame, setIsEditingRoom, isEditingRoom, isGameRunning, timerVisible, setIsConsult, isConsult }) => {

    return (
        <header className="flex-none border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between px-4 z-30 shadow-lg h-14 md:h-16 pt-2 md:pt-0">

            {/* LOGO KOVA */}
            <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
                    <Hexagon className="w-8 h-8 md:w-10 md:h-10 text-white fill-white/10 relative z-10 stroke-[2.5]" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <span className="font-black text-[10px] md:text-xs text-purple-300">K</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-indigo-400 italic drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] text-2xl md:text-3xl" style={{ fontFamily: '"Arial Black", sans-serif' }}>
                        KOVA
                    </h1>
                </div>
            </div>

            {/* Info Manche & Timer */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 top-1/2 -translate-y-1/2 mt-1">
                <div className="hidden md:flex flex-col items-center">
                    {creator === currentUser && !isGameRunning && (
                        <div className='flex gap-2'>
                            <button className='px-4 py-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition cursor-pointer' onClick={() => setIsEditingRoom(!isEditingRoom)}>Modifier la partie</button>
                            <button className="px-4 py-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition cursor-pointer" onClick={handleStartGame}>Lancer partie</button>
                        </div>
                    )}
                    {!isGameRunning && creator !== currentUser && (
                        <div className='flex gap-2'>
                            <button className='px-4 py-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition cursor-pointer' onClick={() => setIsConsult(!isConsult)}>Consulter les règles</button>
                        </div>
                    )}
                </div>
                {
                    (isGameRunning && timerVisible) &&
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300 ${timeLeft < 5 ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-slate-800/40 border-slate-700'} `}>
                        <Clock className={`w-3 h-3 md:w-4 md:h-4 ${timeLeft < 5 ? 'text-red-400 animate-pulse' : 'text-cyan-400'} `} />
                        <span className={`font-mono font-nums ${timeLeft < 5 ? 'text-red-400' : 'text-cyan-400'} text-lg md:text-xl`}>
                            {timeLeft}
                        </span>
                    </div>
                }

            </div>

            <div className="flex items-center gap-3">
                <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition">
                    <Menu className="w-5 h-5 text-white" />
                </button>

                <div className="hidden md:flex items-center gap-3">
                    <div className="flex flex-col text-right">
                        <span className="text-xs font-bold text-white">{currentUser}</span>
                        <span className="text-[10px] text-purple-400 font-mono">Niveau 12</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 ring-2 ring-white/20"></div>
                </div>
            </div>
        </header>
    );
};

export default GameHeader;