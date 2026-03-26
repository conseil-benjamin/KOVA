import React from 'react';
import { User } from '@/types/User';
import { Edit2, UserPlus, MessageSquare, Settings } from 'lucide-react';

interface ProfileHeaderProps {
    user: User;
    isOwner: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwner }) => {
    const percentToNextLevel = Math.min(
        100,
        Math.max(0, (user.stats.xp / (user.stats.xpToNextLevel || 1)) * 100)
    );

    return (
        <div className="relative w-full rounded-3xl p-8 mb-8 overflow-hidden bg-slate-800/50 border border-white/10 backdrop-blur-xl">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">

                {/* Avatar Area */}
                <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/20">
                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${user.avatar || 'from-slate-700 to-slate-800'} flex items-center justify-center border-4 border-slate-900`}>
                            {user.imageUrl ? (
                                <img src={user.imageUrl} alt={user.imageUrl} className={'rounded-full'}/>
                            ) : (
                                <span className="text-3xl font-black text-white/50 tracking-wider">
                                {user.username.substring(0, 2).toUpperCase()}
                            </span>
                            )}
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1.5 border border-white/10 shadow-xl">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-black text-xs px-3 py-1 rounded-full">
                            Lvl {user.stats.level}
                        </div>
                    </div>
                </div>

                {/* User Info Area */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3 justify-center md:justify-start">
                                {user.username}
                                {user.title && (
                                    <span className="text-sm font-semibold tracking-wide text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/20">
                                        {user.title}
                                    </span>
                                )}
                            </h1>
                            <p className="text-slate-400 mt-2 text-sm font-medium">Membre depuis le {/* Format date nicely */} {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-center gap-3">
                            {isOwner ? (
                                <>
                                    <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
                                        <Edit2 size={18} /> Modifier
                                    </button>
                                    <button className="flex items-center justify-center bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white p-2.5 rounded-xl transition-all border border-white/5 hover:border-white/10">
                                        <Settings size={20} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
                                        <UserPlus size={18} /> Ajouter
                                    </button>
                                    <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-white/5 hover:border-white/10 shadow-lg">
                                        <MessageSquare size={18} /> Message
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="mt-6 bg-slate-900/50 rounded-2xl p-4 border border-white/5">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Progression globale</span>
                            <span className="text-sm font-mono text-indigo-400">
                                {user.stats.xp.toLocaleString()} / {(user.stats.xpToNextLevel || 1).toLocaleString()} XP
                            </span>
                        </div>
                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${percentToNextLevel}%` }}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileHeader;
