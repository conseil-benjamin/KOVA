import React from 'react';

// Définition stricte des types pour les propriétés du composant
interface ProgressBarXpUserProps {
    currentLevel: number;
    currentXp: number;
    xpToNextLevel: number;
    xpEarned: number;
}

const ProgressBarXpUser: React.FC<ProgressBarXpUserProps> = ({
                                         currentLevel,
                                         currentXp,
                                         xpToNextLevel,
                                         xpEarned
                                     }) => {
    // Calcul du pourcentage pour la barre (sécurisé pour ne pas dépasser 100%)
    const progressPercentage = Math.min((currentXp / xpToNextLevel) * 100, 100);

    return (
        <div className="w-full max-w-md p-5 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl font-sans">

            {/* En-tête : Niveau à gauche, Compteur à droite */}
            <div className="flex justify-between items-end mb-3">
                <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Niveau
          </span>
                    <span className="text-3xl font-bold text-white leading-none mt-1">
            {currentLevel}
          </span>
                </div>
                <div className="text-right">
          <span className="text-sm font-medium text-gray-300">
            {currentXp} <span className="text-gray-500">/ {xpToNextLevel} XP</span>
          </span>
                </div>
            </div>

            {/* Barre de progression avec animation */}
            <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>

            {/* Affichage des XP gagnés avec un petit style "Succès" */}
            {xpEarned > 0 && (
                <div className="mt-4 flex justify-end">
                    <p className="text-sm font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full shadow-sm border border-emerald-400/20">
                        + {xpEarned} XP Gagnées
                    </p>
                </div>
            )}

        </div>
    );
};

export default ProgressBarXpUser;
