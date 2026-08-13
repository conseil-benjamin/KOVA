import React from 'react';
import { Music, Eye, Lock, Loader, BadgeQuestionMark, ArrowRightLeft, Timer, Blocks } from 'lucide-react';
import LoadingPage from '../loadingPage';
import WaitingForHost from "@/components/game/WaitingForHost";
import CountDown from "@/components/game/CountDown";
import InkDisplay from "@/components/InkDisplay";

interface GameAreaProps {
    isMobileMode?: boolean;
    /** Le joueur courant est le maître de jeu (adapte le texte de l'écran d'attente). */
    isCreator?: boolean;
    /** Actions de lobby (Rejoindre / Lancer / Configurer / Règles) rendues au
     *  centre de l'écran d'attente sur mobile. */
    lobbyActions?: React.ReactNode;
    /** Annulation du lancement, rendue sous le compte à rebours sur mobile. */
    countdownAction?: React.ReactNode;
    hasGuessed: boolean;
    timeLeft: number;
    imageUrl: string;
    question: string;
    theme: string;
    gameStartingSoonTimer: number;
    activesItems: { [key: string]: number; } | undefined;
    jokersLeft: { name: string; useLeft: number }[];
    handleUseJoker: (item: string) => void;
    hint: string;
    activeInk: boolean;
}

const GameArea: React.FC<GameAreaProps> = ({ isMobileMode, isCreator, lobbyActions, countdownAction, hasGuessed, timeLeft, imageUrl, question, theme, gameStartingSoonTimer, activesItems, jokersLeft, handleUseJoker, hint, activeInk }) => {

    return (
        <section className="flex-1 min-h-0 min-w-0 flex flex-col relative z-10">

            <div className={`flex-1 min-h-0 flex flex-col items-center justify-center relative overflow-hidden p-3 pb-4 max-md:kb:p-1.5 md:p-8 ${isMobileMode ? 'pb-24' : ''}`}>

                {/* Game Starting Soon */}
                {!question && !activeInk && (gameStartingSoonTimer === -1) ? (
                    <WaitingForHost isCreator={isCreator} actions={lobbyActions}/>
                ) : gameStartingSoonTimer >= 0 && !question ? (
                    <CountDown gameStartingSoonTimer={ gameStartingSoonTimer } action={countdownAction} />
                ) : activeInk ? (
                    <InkDisplay />
                ) : (
                    <>
                        < div
                            className="relative w-full max-w-full md:max-w-3xl flex-1 min-h-0 md:flex-none md:aspect-video bg-black/50 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl overflow-hidden group hover:border-white/20 transition-all">

                            {imageUrl != '' && imageUrl != null ?
                                <div className="w-full h-full flex flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
                                    {/* Question : prioritaire sur mobile — c'est l'image qui absorbe la
                                        réduction de hauteur quand le clavier s'ouvre, pas l'énoncé. */}
                                    <div className="flex-shrink-0 w-full flex items-center justify-center px-3 md:px-4 py-2 overflow-y-auto max-h-[50%] md:max-h-[25%]">
                                        <p className="text-white text-sm sm:text-base md:text-xl font-bold text-center leading-snug">
                                            {question}
                                        </p>
                                    </div>

                                    {/* Image : prend tout l'espace restant */}
                                    <div className="flex-1 min-h-0 w-full relative overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt="Devinette"
                                            className="absolute inset-0 w-full h-full object-contain transition-all duration-300 ease-out"
                                            style={{ transform: hasGuessed ? 'scale(1)' : 'scale(1.04)' }}
                                        />
                                    </div>
                                </div> :
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center overflow-y-auto">
                                    <p className="text-white text-lg sm:text-xl md:text-2xl font-bold text-center p-4 md:p-5 leading-snug">{question}</p>
                                </div>
                            }

                            {/* Overlay Vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                            {/* Tag de difficulté : en bas à droite sur mobile (en haut à gauche il
                                chevauchait l'énoncé), en haut à gauche à partir de md. */}
                            <div className="absolute bottom-2 right-2 md:bottom-auto md:right-auto md:top-4 md:left-4 flex justify-end md:justify-start gap-2 max-w-[calc(100%-1rem)]">
                                <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold text-white border border-white/10 flex items-center gap-1.5 md:gap-2 shadow-lg min-w-0">
                                    <Blocks className="w-3 h-3 text-pink-400 shrink-0" />
                                    <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent truncate">{theme}</span>
                                </div>
                            </div>

                            {/* Feedback Victoire */}
                            {hasGuessed && (
                                <div className="absolute inset-0 bg-green-500/20 flex flex-col items-center justify-center backdrop-[2px] animate-in fade-in zoom-in duration-300">
                                    <div className="bg-black/80 text-green-400 px-4 py-2.5 md:px-6 md:py-3 rounded-2xl border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.4)] backdrop-blur-xl transform rotate-[-2deg]">
                                        <span className="font-black italic tracking-tighter text-2xl md:text-4xl">CORRECT !</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Jokers Left : dans le flux (et non en overlay) pour ne pas masquer l'image sur mobile */}
                        <div className="shrink-0 flex flex-row flex-wrap items-center justify-center gap-3 z-20 empty:mt-0 mt-3 md:mt-8 md:gap-6 max-md:kb:hidden">
                            {jokersLeft && jokersLeft.map((item, index) => {
                                const isActive = Array.isArray(activesItems)
                                    ? (activesItems.find(a => a.id === item.name)?.maxUses ?? 0) > 0
                                    : ((activesItems as any)?.[item.name] ?? 0) > 0;
                                return isActive && (
                                    item.name === "hint" && (
                                        <div key={index} className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2 shadow-lg cursor-pointer active:scale-95 transition">
                                            <Eye className="w-3 h-3 text-pink-400 shrink-0" />
                                            <button disabled={item.useLeft == 0} onClick={() => handleUseJoker(item.name)} className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent capitalize disabled:opacity-50">{item.name} <span className="text-white ml-1 font-mono">{item.useLeft}</span></button>
                                        </div>
                                    )
                                )
                            })}
                        </div>

                        {/* Hint */}
                        {hint && (
                            <div className="shrink-0 flex items-center justify-center gap-2 mt-3 md:mt-5 max-w-full bg-black/60 backdrop-blur-md px-3 py-2 rounded-2xl md:rounded-full text-xs font-bold text-white border border-white/10 shadow-lg">
                                <Eye className="w-3 h-3 text-pink-400 shrink-0" />
                                <span className="break-words text-center">{hint}</span>
                            </div>
                        )}

                    </>
                )}

            </div>
        </section >
    );
};

export default GameArea;
