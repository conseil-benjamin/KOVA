import React from 'react';
import { Users, Trophy, Target, Clock } from 'lucide-react';

import { Player } from '@/types/Room';

interface LeaderboardProps {
    players: Player[];
    scoreToWin: number;
    username: string;
}

const RANK_STYLES = [
    'bg-gradient-to-br from-yellow-300 to-yellow-500 text-black shadow-[0_0_10px_rgba(250,204,21,0.4)]',
    'bg-gradient-to-br from-slate-200 to-slate-400 text-black',
    'bg-gradient-to-br from-orange-400 to-orange-600 text-black',
];

const Leaderboard: React.FC<LeaderboardProps> = ({ players, scoreToWin, username }) => {
    return (
        <aside className="flex-none order-1 md:order-none w-full md:w-64 bg-black/20 md:bg-[#0a0a12]/50 border-b md:border-b-0 md:border-r border-white/5 flex flex-row md:flex-col backdrop-blur-sm z-20 overflow-hidden">

            {/* HEADER (Desktop Only) */}
            <div className="hidden md:flex items-center gap-2 px-4 pt-4 pb-3">
                <div className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                </div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    Classement
                </h2>
                <Users className="w-3.5 h-3.5 text-slate-500 ml-auto" />
            </div>

            {/* SUB-HEADER : L'objectif de victoire */}
            <div className="hidden md:block px-4 pb-3">
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                        <Target className="w-3 h-3 text-yellow-400" /> Objectif
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-mono font-bold text-yellow-400">{scoreToWin}</span>
                        <span className="text-[10px] text-slate-500">pts</span>
                    </div>
                </div>
            </div>

            {/* Séparateur subtil */}
            <div className="hidden md:block h-[1px] mx-4 bg-gradient-to-r from-transparent via-white/10 to-transparent mb-2" />

            <div className="flex-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible md:overflow-y-auto p-2 md:p-3 space-x-2 md:space-x-0 md:space-y-2 no-scrollbar mask-gradient-right md:mask-none">
                {players && players.length > 0 && [...players].sort((a, b) => b.score - a.score).map((player, idx) => {
                    const isCurrentUser = player.username.toLowerCase() === username.toLowerCase();
                    const rankStyle = RANK_STYLES[idx] || 'bg-white/10 text-slate-300';

                    return (
                        // CARD
                        <div key={player.username} className={`
                            flex-none flex items-center gap-2 md:gap-3 p-2 md:p-2.5 rounded-xl border transition-all duration-300
                            ${player.hasGuessed
                                ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                : isCurrentUser
                                    ? 'bg-white/[0.06] border-white/15'
                                    : 'bg-white/[0.04] border-white/5 hover:bg-white/[0.08] hover:border-white/10'}
                            flex-col md:flex-row w-16 md:w-auto
                        `}>
                            <span className={`hidden md:flex items-center justify-center font-mono text-[10px] font-bold w-5 h-5 rounded-full shrink-0 ${rankStyle}`}>{idx + 1}</span>

                            <div className="relative shrink-0">
                                {player.imageUrl ? (
                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr flex items-center justify-center text-[10px] md:text-xs font-bold shadow-lg ring-2 ${player.hasGuessed ? 'ring-green-400' : 'ring-white/10'}`}>
                                        <img src={player.imageUrl} alt={player.username} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                ) : (
                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${player.avatar} flex items-center justify-center text-[10px] md:text-xs font-bold shadow-lg ring-2 ${player.hasGuessed ? 'ring-green-400' : 'ring-white/10'}`}>
                                        {player.username.substring(0, 1)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col items-center md:items-start w-full">
                                <div className="flex justify-between items-center w-full gap-2">
                                    <span className={`truncate max-w-full md:max-w-[60px] text-[9px] md:text-sm font-semibold ${player.hasGuessed ? 'text-green-400' : isCurrentUser ? 'text-purple-300' : 'text-slate-100'} text-center md:text-left`}>
                                        {player.username}
                                    </span>
                                    <span className="text-[9px] md:text-sm font-mono font-bold text-white shrink-0 text-center md:text-left">
                                        {player.score}
                                    </span>
                                </div>

                                {player.responseTime != 0 && player.responseTime != undefined ? (
                                    <span className="hidden md:flex items-center gap-1 text-[10px] text-green-400 font-mono mt-0.5">
                                        <Clock className="w-2.5 h-2.5" /> {player.responseTime}s
                                    </span>
                                ) : (!player.hasGuessed && player.answer && (
                                    <span className="hidden md:block text-[10px] text-slate-400 font-mono">{player.answer.substring(0, 20)} {player.answer.length > 20 && '...'}</span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default Leaderboard;
