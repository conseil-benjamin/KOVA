import React from 'react';
import { Home, SearchX } from 'lucide-react';

const RoomNotFound: React.FC = () => {
    return (
        <div className="app-shell min-h-[100dvh] bg-[#0a0a0f] flex items-center justify-center px-4 py-10">
            <div className="max-w-md w-full text-center">
                {/* Illustration / Icône */}
                <div className="mb-6 md:mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl opacity-70 animate-pulse"></div>
                        <SearchX className="relative text-red-500 stroke-[1.5] w-16 h-16 md:w-20 md:h-20" />
                    </div>
                </div>

                {/* Texte */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                    Oups ! Salle introuvable
                </h1>
                <p className="text-slate-400 mb-8 text-sm md:text-lg leading-relaxed">
                    Il semblerait que cette partie n&apos;existe pas ou qu&apos;elle ait été fermée par son hôte. Vérifiez bien le lien ou le code saisi !
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-900/40 cursor-pointer"
                    >
                        <Home size={20} />
                        Retour à l&apos;accueil
                    </button>
                </div>

                {/* Petit footer discret */}
                <p className="mt-10 md:mt-12 text-xs md:text-sm text-slate-600">
                    Erreur 404 • Room ID non valide
                </p>
            </div>
        </div>
    );
};

export default RoomNotFound;