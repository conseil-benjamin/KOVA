import { Trophy } from 'lucide-react';

export default function SidebarRight() {
    return (
        <div className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Leaderboard Semaine */}
            <div className="bg-[#13131f] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" /> Top Semaine
                    </h3>
                    <button className="text-[10px] text-purple-400 hover:text-purple-300">Voir tout</button>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((rank) => (
                        <div key={rank} className="flex items-center gap-3 text-sm">
                            <span className={`w-5 text-center font-bold ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-orange-400' : 'text-slate-600'}`}>{rank}</span>
                            <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                            <div className="flex-1">
                                <div className="font-bold text-slate-200">Player_{rank}</div>
                                <div className="text-[10px] text-slate-500">{15000 - (rank * 500)} PTS</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* News / Update */}
            <div className="bg-gradient-to-b from-purple-900/20 to-transparent border border-purple-500/20 rounded-2xl p-5">
                <div className="bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-2">NOUVEAU</div>
                <h3 className="font-bold text-white mb-2">Mise à jour v2.1</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Ajout du mode "Blind Test", corrections de bugs sur mobile et nouveaux packs communautaires.
                </p>
                <button className="text-xs text-purple-400 hover:text-purple-300 underline">Lire le patch note</button>
            </div>
        </div>
    );
}
