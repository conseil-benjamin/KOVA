import { User } from '@/types/User';
import { Users, Plus, Play, Flame } from 'lucide-react';
import { Progress } from "@/components/ui/progress"
import { redirect } from 'next/navigation';

interface SidebarLeftProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    user: User | null;
}

export default function SidebarLeft({ isLoggedIn, setIsLoggedIn, user }: SidebarLeftProps) {
    const xpToNextLevel = user?.stats?.xpToNextLevel;
    const xp = user?.stats?.xp;
    const level = user?.stats?.level;
    const xpPercentage = (xp / xpToNextLevel) * 100;

    return (
        <div className="lg:col-span-3 space-y-6">
            {/* Carte Profil / Guest */}
            <div className="bg-[#13131f] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

                {isLoggedIn ? (
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 shadow-lg ring-4 ring-[#0a0a0f] flex items-center justify-center text-2xl font-bold">{user?.username.charAt(0).toUpperCase()}</div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-white">Niveau {level}</div>
                                <div className="text-xs text-purple-400 font-mono">{xp} XP / {xpToNextLevel} XP</div>
                            </div>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-4">
                            <Progress value={xpPercentage} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-black/40 rounded-lg p-2">
                                <div className="text-xs text-slate-500 uppercase">Victoires</div>
                                <div className="font-bold text-white">{user?.stats?.gamesWon}</div>
                            </div>
                            <div className="bg-black/40 rounded-lg p-2">
                                <div className="text-xs text-slate-500 uppercase">Parties</div>
                                <div className="font-bold text-white">{user?.stats?.gamesPlayed}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 text-center space-y-4 py-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <Users className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Mode Invité</h3>
                            <p className="text-xs text-slate-400 mt-1">Crée un compte pour sauvegarder tes stats et personnaliser ton avatar.</p>
                        </div>
                        <button onClick={() => setIsLoggedIn(true)} className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-bold transition">
                            Se connecter
                        </button>
                    </div>
                )}
            </div>

            {/* Boutons d'Action Rapide */}
            <div className="space-y-3">
                <button onClick={() => redirect('/createRoom')} className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] rounded-xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg shadow-purple-900/20 transition-all group">
                    <div className="bg-white/20 p-1.5 rounded-full group-hover:rotate-90 transition duration-300"><Plus className="w-5 h-5" /></div>
                    Créer une Room
                </button>
                <button className="w-full h-12 bg-[#1a1a24] hover:bg-[#20202e] border border-white/5 rounded-xl flex items-center justify-center gap-3 font-medium text-slate-300 transition-all hover:text-white group">
                    <div className="bg-green-500/20 p-1.5 rounded-full text-green-400"><Play className="w-4 h-4 fill-current" /></div>
                    Rejoindre Rapidement
                </button>
            </div>

            {/* Challenge Quotidien */}
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-orange-400 mb-2">
                    <Flame className="w-4 h-4 fill-orange-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">Challenge du jour</span>
                </div>
                <h3 className="font-bold text-white mb-1">Expert des Logos</h3>
                <p className="text-xs text-slate-400 mb-3">Trouve 5 logos en moins de 3s dans le pack "Marques".</p>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-white bg-orange-500/20 px-2 py-1 rounded border border-orange-500/30">+500 XP</span>
                    <span className="text-slate-500">2/5 complété</span>
                </div>
            </div>
        </div>
    );
}
