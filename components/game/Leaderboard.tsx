import React from 'react';
import { Users, Trophy } from 'lucide-react';

export interface Player {
    id: number;
    username: string;
    score: number;
    hasGuessed: boolean;
    answer: string;
}

interface LeaderboardProps {
    players: Player[];
    scoreToWin: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, scoreToWin }) => {
    return (
        <aside className="flex-none order-1 md:order-none w-full md:w-64 bg-black/20 md:bg-[#0a0a12]/50 border-b md:border-b-0 md:border-r border-white/5 flex flex-row md:flex-col backdrop-blur-sm z-20 overflow-hidden">

            {/* HEADER (Desktop Only) */}
            {/* HEADER : Simple et aéré */}
            <div className="hidden md:flex p-4 items-center justify-between">
                <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Users className="w-3 h-3" /> Classement
                </h2>
                <Trophy className="w-3 h-3 text-slate-600" />
            </div>

            {/* SUB-HEADER : L'objectif de victoire (plus fin) */}
            <div className="hidden md:block px-4 pb-3">
                <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-2 flex items-center justify-between">
                    <span className="text-[9px] font-medium text-yellow-600/80 uppercase">Objectif</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-yellow-500">{scoreToWin}</span>
                        <span className="text-[9px] text-yellow-600/50 italic">pts</span>
                    </div>
                </div>
            </div>

            {/* Séparateur subtil */}
            <div className="hidden md:block h-[1px] mx-4 bg-gradient-to-r from-transparent via-white/5 to-transparent mb-2" />

            <div className="flex-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible md:overflow-y-auto p-2 md:p-3 space-x-2 md:space-x-0 md:space-y-2 no-scrollbar mask-gradient-right md:mask-none">
                {[...players].sort((a, b) => b.score - a.score).map((player, idx) => (

                    // CARD
                    <div key={player.username} className={`
                        flex-none flex items-center gap-2 md:gap-3 p-2 rounded-xl border transition-all duration-300
                        ${player.hasGuessed ? 'bg-white/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-transparent border-transparent md:hover:bg-white/5'}
                        flex-col md:flex-row w-16 md:w-auto
                    `}>
                        <span className={`hidden md:block font-mono text-sm w-4 text-center ${idx < 3 ? 'text-yellow-400 font-bold' : 'text-slate-500'}`}>{idx + 1}</span>

                        <div className="relative">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${player.avatar} flex items-center justify-center text-[10px] md:text-xs font-bold shadow-lg ring-2 ${player.hasGuessed ? 'ring-green-400' : 'ring-transparent'}`}>
                                {player.username.substring(0, 1)}
                            </div>
                            {/* {player.hasGuessed && <div className="hidden md:block absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5 border border-black"><Flame className="w-2 h-2 text-white" /></div>} */}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col items-center md:items-start w-full">
                            <div className="flex justify-between w-full">
                                <span className={`text-[9px] md:text-sm font-medium truncate max-w-full md:max-w-[100px] ${player.hasGuessed ? 'text-green-400' : 'text-slate-200'} text-center md:text-left`}>{player.username}</span>
                                <span className="text-[9px] md:text-sm font-medium truncate max-w-full md:max-w-[100px] text-slate-200 text-center md:text-left">{player.score}</span>
                            </div>

                            {/* Score Bar (Desktop Only) */}
                            {/* <div className="hidden md:block w-full bg-white/10 h-1 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${(player.score / 2000) * 100}%` }}></div>
                            </div>
                            <span className="hidden md:block text-[10px] text-slate-400 font-mono">{player.score} pts</span> */}
                            {!player.hasGuessed && player.answer && <span className="hidden md:block text-[10px] text-slate-400 font-mono">{player.answer.substring(0, 20)} {player.answer.length > 20 && '...'}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Leaderboard;
