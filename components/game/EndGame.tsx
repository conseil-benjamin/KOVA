import React from 'react';
import { Trophy, Medal, Home, RotateCcw, Edit } from 'lucide-react';
import { Player } from "./Leaderboard";

interface EndGameProps {
    players: Player[];
    creator: string;
    username: string;
    setIsEditingRoom: (value: boolean) => void;
    isEditingRoom: boolean;
    handleRestartGame: () => void;
}

const EndGame: React.FC<EndGameProps> = ({ players, creator, username, setIsEditingRoom, isEditingRoom, handleRestartGame }) => {
    // Trier les joueurs par score décroissant et prendre les 3 meilleurs
    const podium = [...players]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    // Organiser pour l'affichage visuel : [2ème, 1er, 3ème]
    const orderedPodium = [
        podium[1] || null, // Argent
        podium[0] || null, // Or
        podium[2] || null  // Bronze
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4 py-12">
            <h1 className="text-5xl font-extrabold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 italic">
                CLASSEMENT FINAL
            </h1>

            <div className="flex flex-row items-end justify-center gap-4 w-full max-w-4xl mb-12">
                {orderedPodium.map((player, index) => {
                    if (!player) return <div key={index} className="flex-1" />;

                    const isFirst = player === podium[0];
                    const isSecond = player === podium[1];
                    const isThird = player === podium[2];

                    return (
                        <div key={player.id} className="flex flex-col items-center flex-1">
                            {/* Avatar et Nom */}
                            <div className="mb-4 text-center">
                                <p className="font-bold text-lg truncate w-24 sm:w-32">{player.username}</p>
                                <p className="text-indigo-400 font-mono">{player.score} pts</p>
                            </div>

                            {/* Colonne du podium */}
                            <div
                                className={`w-full rounded-t-2xl flex flex-col items-center justify-start pt-6 transition-all duration-700 ease-out shadow-2xl
                                ${isFirst ? 'h-64 bg-yellow-500 scale-110 z-10' : ''}
                                ${isSecond ? 'h-48 bg-slate-400' : ''}
                                ${isThird ? 'h-32 bg-amber-700' : ''}
                                `}
                            >
                                {isFirst && <Trophy size={48} className="text-yellow-200 animate-bounce" />}
                                {isSecond && <Medal size={40} className="text-slate-200" />}
                                {isThird && <Medal size={40} className="text-amber-200" />}

                                <span className="text-4xl font-black mt-2 opacity-50">
                                    {isFirst ? '1' : isSecond ? '2' : '3'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-full transition-colors">
                    <Home size={20} /> Accueil
                </button>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/20 transition-transform hover:scale-105">
                    <RotateCcw size={20} onClick={handleRestartGame} /> Rejouer
                </button>
                {creator.toLowerCase() === username.toLowerCase() && (
                    <button
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/20 transition-transform hover:scale-105"
                        onClick={() => {
                            setIsEditingRoom(!isEditingRoom);
                        }}
                    >
                        <Edit size={20} className='cursor-pointer'/> Modifier règles
                    </button>
                )}
            </div>
        </div>
    );
};

export default EndGame;