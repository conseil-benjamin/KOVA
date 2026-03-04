import React from 'react';
import { UserStats } from '@/types/User';
import {
    Trophy,
    Gamepad2,
    Target,
    Clock,
    Flame,
    Zap,
    Award,
    Medal
} from 'lucide-react';

interface StatsGridProps {
    stats: UserStats;
}

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    colorClass: string;
    highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, colorClass, highlight }) => (
    <div className={`p-5 rounded-2xl border bg-slate-800/30 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl ${highlight ? 'border-indigo-500/30 shadow-indigo-500/10' : 'border-white/5 hover:border-white/10'
        }`}>
        <div className="flex items-center gap-4 mb-3">
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</h3>
        </div>
        <div className="text-3xl font-black text-white font-mono tracking-tight">
            {value}
        </div>
    </div>
);

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
    const winRate = stats.gamesPlayed > 0
        ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
        : 0;

    return (
        <div className="space-y-6">

            {/* Primary Highlights Section */}
            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-4">
                <Trophy className="text-yellow-500" />
                Performances Globales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    icon={Gamepad2}
                    label="Parties Jouées"
                    value={stats.gamesPlayed.toLocaleString()}
                    colorClass="bg-blue-500/20 text-blue-400"
                />
                <StatCard
                    icon={Award}
                    label="Victoires"
                    value={stats.gamesWon.toLocaleString()}
                    colorClass="bg-green-500/20 text-green-400"
                    highlight
                />
                <StatCard
                    icon={Target}
                    label="Win Rate"
                    value={`${winRate}%`}
                    colorClass="bg-red-500/20 text-red-400"
                />
            </div>

            {/* Advanced Stats Section */}
            <h2 className="text-xl font-black text-white flex items-center gap-2 mt-10 mb-4">
                <Zap className="text-indigo-500" />
                Statistiques Détaillées
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-white/5 bg-slate-800/30 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <Flame size={18} className="text-orange-500" />
                        <span className="text-sm font-semibold uppercase">Win Streak Actuelle</span>
                    </div>
                    <p className="text-2xl font-black text-white mt-1">{stats.winsStreak || 0}</p>
                    <div className="text-xs text-orange-400/80 mt-2 bg-orange-500/10 inline-block px-2 py-1 rounded w-max">
                        Best: {stats.bestWinsStreak || 0}
                    </div>
                </div>

                <div className="p-5 rounded-2xl border border-white/5 bg-slate-800/30 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <TimerIcon size={18} className="text-cyan-500" />
                        <span className="text-sm font-semibold uppercase">Tps de rép. min</span>
                    </div>
                    <p className="text-2xl font-black text-white mt-1">
                        {stats.bestResponseTime ? `${stats.bestResponseTime.toFixed(2)}s` : '-'}
                    </p>
                    <div className="text-xs text-slate-500 mt-2">
                        Record de rapidité
                    </div>
                </div>

                <div className="p-5 rounded-2xl border border-white/5 bg-slate-800/30 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <Medal size={18} className="text-yellow-500" />
                        <span className="text-sm font-semibold uppercase">Podiums</span>
                    </div>
                    <p className="text-2xl font-black text-white mt-1">{stats.gamesPodium || 0}</p>
                    <div className="text-xs text-slate-500 mt-2">
                        Top 3 Finishes
                    </div>
                </div>

                <div className="p-5 rounded-2xl border border-white/5 bg-slate-800/30 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <Clock size={18} className="text-purple-500" />
                        <span className="text-sm font-semibold uppercase">Total Joué</span>
                    </div>
                    <p className="text-2xl font-black text-white mt-1">{stats.totalPlayTime || 0}h</p>
                    <div className="text-xs text-slate-500 mt-2">
                        Heures en jeu
                    </div>
                </div>
            </div>

            {/* Knowledge Section */}
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Total de bonnes réponses</h3>
                        <p className="text-indigo-200/70 text-sm">Votre base de connaissance en action</p>
                    </div>
                    <div className="text-4xl font-black text-indigo-400 flex items-baseline gap-1">
                        {stats.totalCorrectAnswers.toLocaleString()}
                        <span className="text-sm text-indigo-500/50">pts</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

const TimerIcon = ({ size, className }: { size: number, className: string }) => (
    // Custom simple SVG since lucide doesn't have a perfect "fast response" timer
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export default StatsGrid;
