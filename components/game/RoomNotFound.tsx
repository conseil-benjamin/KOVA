import React from 'react';
import { Home, SearchX } from 'lucide-react'; // Installe lucide-react si besoin

const RoomNotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Illustration / Icône */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                        <SearchX size={80} className="relative text-red-500 stroke-[1.5]" />
                    </div>
                </div>

                {/* Texte */}
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Oups ! Salle introuvable
                </h1>
                <p className="text-slate-600 mb-8 text-lg">
                    Il semblerait que cette room n'existe pas ou qu'elle ait été fermée par son hôte. Vérifiez bien le lien ou le code saisi !
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200"
                    >
                        <Home size={20} />
                        Retour à l'accueil
                    </button>
                </div>

                {/* Petit footer discret */}
                <p className="mt-12 text-sm text-slate-400">
                    Erreur 404 • Room ID non valide
                </p>
            </div>
        </div>
    );
};

export default RoomNotFound;