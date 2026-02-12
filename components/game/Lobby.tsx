import React from 'react';
import { Player } from '@/types/Room';
import { Users } from 'lucide-react';

interface LobbyProps {
    players: Player[];
}

const Lobby: React.FC<LobbyProps> = ({ players }) => {
    return (
        <div className="w-full max-w-4xl mt-8 mb-4 px-4 fadeIn">
            <div className="flex items-center gap-2 mb-3 text-slate-400">
                <Users size={16} />
                <h3 className="text-xs font-bold uppercase tracking-widest">Joueurs en attente ({players.length})</h3>
            </div>

            <div className="flex flex-row overflow-x-auto gap-3 pb-4 no-scrollbar mask-gradient-right items-center">
                {players.length === 0 ? (
                    <div className="text-slate-500 text-sm italic w-full text-center py-4 bg-slate-800/20 rounded-lg border border-white/5 border-dashed">
                        En attente des joueurs...
                    </div>
                ) : (
                    players.map((player) => (
                        <div key={player.id + player.username} className="flex flex-col items-center gap-2 min-w-[70px] group select-none">
                            <div className={`relative w-12 h-12 rounded-full bg-gradient-to-tr ${player.avatar || 'from-indigo-500 to-purple-500'} flex items-center justify-center shadow-lg ring-2 ring-white/5 group-hover:ring-white/20 group-hover:scale-105 transition-all duration-300`}>
                                <span className="font-bold text-lg text-white drop-shadow-md">
                                    {player.username.substring(0, 1).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-[10px] font-medium text-slate-400 truncate max-w-[80px] text-center group-hover:text-slate-200 transition-colors bg-black/20 px-2 py-0.5 rounded-full">
                                {player.username}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Lobby;
