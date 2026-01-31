import React from 'react';
import { Users, Trophy, Flame } from 'lucide-react';

export interface Player {
    id: number;
    username: string;
    score: number;
    hasGuessed: boolean;
    answer: string;
}

interface LeaderboardProps {
    players: Player[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
    return (
        <aside className="flex-none order-1 md:order-none w-full md:w-64 bg-black/20 md:bg-[#0a0a12]/50 border-b md:border-b-0 md:border-r border-white/5 flex flex-row md:flex-col backdrop-blur-sm z-20 overflow-hidden">

            {/* HEADER (Desktop Only) */}
            <div className="hidden md:block p-4 border-b border-white/5">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-3 h-3" /> Classement
                </h2>
            </div>

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
                            {player.hasGuessed && <div className="hidden md:block absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5 border border-black"><Flame className="w-2 h-2 text-white" /></div>}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col items-center md:items-start w-full">
                            <div className="flex justify-between w-full">
                                <span className={`text-[9px] md:text-sm font-medium truncate max-w-full md:max-w-[100px] ${player.hasGuessed ? 'text-green-400' : 'text-slate-200'} text-center md:text-left`}>{player.username}</span>
                                {player.hasGuessed && <Trophy className="hidden md:block w-3 h-3 text-green-400" />}
                            </div>

                            {/* Score Bar (Desktop Only) */}
                            {/* <div className="hidden md:block w-full bg-white/10 h-1 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${(player.score / 2000) * 100}%` }}></div>
                            </div>
                            <span className="hidden md:block text-[10px] text-slate-400 font-mono">{player.score} pts</span> */}
                            {!player.hasGuessed && <span className="hidden md:block text-[10px] text-slate-400 font-mono">{player.answer}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Leaderboard;
