import React from 'react';
import { Music, Eye, Lock, Loader, BadgeQuestionMark, ArrowRightLeft, Timer, Blocks } from 'lucide-react';
import LoadingPage from '../loadingPage';
import WaitingForHost from "@/components/game/WaitingForHost";
import CountDown from "@/components/game/CountDown";

interface GameAreaProps {
    isMobileMode?: boolean;
    hasGuessed: boolean;
    timeLeft: number;
    imageUrl: string;
    question: string;
    theme: string;
    gameStartingSoonTimer: number;
    activesItems: { id: string; maxUses: number }[];
    jokersLeft: { name: string; useLeft: number }[];
    handleUseJoker: (item: string) => void;
    hint: string;
    activeInk;
}

const GameArea: React.FC<GameAreaProps> = ({ isMobileMode, hasGuessed, timeLeft, imageUrl, question, theme, gameStartingSoonTimer, activesItems, jokersLeft, handleUseJoker, hint, activeInk }) => {
    console.log("activesItems" + JSON.stringify(activesItems));
    console.log("jokersLeft" + JSON.stringify(jokersLeft));
    return (
        <section className="flex-1 flex flex-col relative z-10">

            <div className={`flex-1 flex flex-col items-center justify-center relative ${isMobileMode ? 'p-4 pb-24' : 'p-8 pb-8'}`}>

                {/* Game Starting Soon */}
                {gameStartingSoonTimer > 0 ? (
                    <CountDown gameStartingSoonTimer={ gameStartingSoonTimer } />
                ) : (gameStartingSoonTimer < 0 || gameStartingSoonTimer === 0) && !question ? (
                    <WaitingForHost/>
                ) : activeInk ? (
                    <div>
                        <h1>INKKKKKKKKKKK</h1>
                    </div>
                ) : (
                    <>
                        < div
                            className={`relative w-full aspect-[4/3] bg-black/50 rounded-2xl border border-white/10 shadow-2xl overflow-hidden group hover:border-white/20 transition-all ${isMobileMode ? 'max-w-full rounded-2xl' : 'max-w-3xl aspect-video rounded-3xl'}`}>

                            {imageUrl != '' && imageUrl != null ?
                                <div
                                    className="w-full h-full flex flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
                                    {/* Section Question : Prend 1/5 de la hauteur */}
                                    <div className="h-1/5 w-full flex items-center justify-center p-4">
                                        <p className="text-white text-xl md:text-2xl font-bold text-center">
                                            {question}
                                        </p>
                                    </div>

                                    {/* Section Image : */}
                                    <div className="h-4/5 w-full overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt="Devinette"
                                            className="w-full h-full object-contain transition-all duration-300 ease-out"
                                            style={{transform: hasGuessed ? 'scale(1)' : 'scale(1.1)'}}
                                        />
                                    </div>
                                </div> :
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                <p className="text-white text-2xl font-bold text-center">{question}</p>
                                </div>
                            }

                            {/* Overlay Vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                            {/* Tags Catégorie */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <div className="bg-black/60 backdrop-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2 shadow-lg">
                                    <Blocks className="w-3 h-3 text-pink-400" />
                                    <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">{theme}</span>
                                </div>
                            </div>

                            {/* Feedback Victoire */}
                            {hasGuessed && (
                                <div className="absolute inset-0 bg-green-500/20 flex flex-col items-center justify-center backdrop-[2px] animate-in fade-in zoom-in duration-300">
                                    <div className="bg-black/80 text-green-400 px-6 py-3 rounded-2xl border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.4)] backdrop-xl transform rotate-[-2deg]">
                                        <span className={`font-black italic tracking-tighter ${isMobileMode ? 'text-2xl' : 'text-4xl'}`}>CORRECT !</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Jokers Left */}
                        <div className="flex gap-3 z-20 absolute bottom-4 left-4 flex-col md:static md:flex-row md:mt-8 md:gap-6">
                            {jokersLeft && jokersLeft.map((item, index) => {
                                const isActive = Array.isArray(activesItems)
                                    ? (activesItems.find(a => a.id === item.name)?.maxUses ?? 0) > 0
                                    : ((activesItems as any)?.[item.name] ?? 0) > 0;
                                return isActive && (
                                    <div key={index} className="bg-black/60 backdrop-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2 shadow-lg cursor-pointer">
                                        {item.name === "hint" && <Eye className="w-3 h-3 text-pink-400" />}
                                        {item.name === "freeze" && <Timer className="w-3 h-3 text-pink-400" />}
                                        {item.name === "ink" && <Music className="w-3 h-3 text-pink-400" />}
                                        {item.name === "swap" && <ArrowRightLeft className="w-3 h-3 text-pink-400" />}
                                        <button disabled={item.useLeft == 0} onClick={() => handleUseJoker(item.name)} className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent capitalize disabled:opacity-50">{item.name} <span className="text-white ml-1 font-mono">{item.useLeft}</span></button>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Hint */}
                        {hint && (
                            <div className="flex items-center justify-center mt-5 align-center bg-black/60 backdrop-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 shadow-lg">
                                <Eye className="w-3 h-3 text-pink-400" />
                                <span>{hint}</span>
                            </div>
                        )}

                    </>
                )}

            </div>
        </section >
    );
};

export default GameArea;
