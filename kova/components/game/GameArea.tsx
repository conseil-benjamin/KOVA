import React from 'react';
import { Music, Eye, Lock } from 'lucide-react';

interface GameAreaProps {
    isMobileMode: boolean;
    blurAmount: number;
    hasGuessed: boolean;
    timeLeft: number;
}

const GameArea: React.FC<GameAreaProps> = ({ isMobileMode, blurAmount, hasGuessed, timeLeft }) => {
    return (
        <section className="flex-1 flex flex-col relative z-10">

            <div className={`flex-1 flex flex-col items-center justify-center relative ${isMobileMode ? 'p-4 pb-24' : 'p-8 pb-8'}`}>

                {/* Carte du jeu */}
                <div className={`relative w-full aspect-[4/3] bg-black/50 rounded-2xl border border-white/10 shadow-2xl overflow-hidden group hover:border-white/20 transition-all ${isMobileMode ? 'max-w-full rounded-2xl' : 'max-w-3xl aspect-video rounded-3xl'}`}>

                    {/* L'image floutée */}
                    <div className="absolute inset-0 bg-gray-900">
                        <img
                            src="/api/placeholder/800/600"
                            alt="Devinette"
                            className="w-full h-full object-cover transition-all duration-300 ease-out"
                            style={{ filter: `blur(${blurAmount}px)`, transform: hasGuessed ? 'scale(1.02)' : 'scale(1.05)' }}
                        />
                    </div>

                    {/* Overlay Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                    {/* Tags Catégorie */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2 shadow-lg">
                            <Music className="w-3 h-3 text-pink-400" />
                            <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">Culture Internet</span>
                        </div>
                    </div>

                    {/* Feedback Victoire */}
                    {hasGuessed && (
                        <div className="absolute inset-0 bg-green-500/20 flex flex-col items-center justify-center backdrop-blur-[2px] animate-in fade-in zoom-in duration-300">
                            <div className="bg-black/80 text-green-400 px-6 py-3 rounded-2xl border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.4)] backdrop-blur-xl transform rotate-[-2deg]">
                                <span className={`font-black italic tracking-tighter ${isMobileMode ? 'text-2xl' : 'text-4xl'}`}>CORRECT !</span>
                            </div>
                            <span className="mt-4 text-white font-mono font-bold text-xl drop-shadow-lg">+ {Math.floor(timeLeft * 100)} pts</span>
                        </div>
                    )}
                </div>

                {/* BONUS */}
                <div className="flex gap-3 z-20 absolute bottom-4 right-4 flex-col md:static md:flex-row md:mt-8 md:gap-6">
                    <button className="backdrop-blur-md flex items-center justify-center gap-3 transition-all active:scale-95 group shadow-lg w-10 h-10 md:w-auto md:h-auto md:px-6 md:py-3 rounded-full md:rounded-xl bg-indigo-600/20 border border-indigo-500/30 md:hover:bg-indigo-600 md:hover:border-indigo-400 text-indigo-200">
                        <Eye className="w-4 h-4 md:w-5 md:h-5 md:group-hover:text-white" />
                        <span className="hidden md:block font-bold md:group-hover:text-white">Indice</span>
                        <span className="bg-black rounded text-indigo-400 border border-indigo-500/30 absolute -top-1 -right-1 text-[9px] px-1 md:static md:text-xs md:ml-2 md:px-1.5 md:py-0.5">50</span>
                    </button>

                    <button className="backdrop-blur-md flex items-center justify-center gap-3 transition-all active:scale-95 group shadow-lg w-10 h-10 md:w-auto md:h-auto md:px-6 md:py-3 rounded-full md:rounded-xl bg-blue-600/20 border border-blue-500/30 md:hover:bg-blue-600 md:hover:border-blue-400 text-blue-200">
                        <Lock className="w-4 h-4 md:w-5 md:h-5 md:group-hover:text-white" />
                        <span className="hidden md:block font-bold md:group-hover:text-white">Freeze</span>
                        <span className="bg-black rounded text-blue-400 border border-blue-500/30 absolute -top-1 -right-1 text-[9px] px-1 md:static md:text-xs md:ml-2 md:px-1.5 md:py-0.5">100</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default GameArea;
