import React from "react";
import { redirect } from "next/navigation";
import { Ban, Home } from "lucide-react";

const PlayerIsBan: React.FC = () => {
    const handleRedirect = () => {
        redirect(`/`)
    }

    return (
        <div className="flex flex-col items-center justify-center text-center px-6 py-12 max-w-md mx-auto">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <Ban className="w-9 h-9 text-red-400 stroke-[1.5]" />
            </div>

            {/* Badge */}
            <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                Accès refusé
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
                Vous avez été banni
            </h1>

            {/* Description */}
            <p className="text-slate-400 text-sm md:text-base mb-10 leading-relaxed">
                L'hôte de cette partie vous a exclu de ce salon. Vous ne pouvez plus le rejoindre, mais rien ne vous empêche d'en créer ou d'en rejoindre un autre.
            </p>

            {/* CTA */}
            <button
                onClick={handleRedirect}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:shadow-[0_0_30px_rgba(239,68,68,0.55)] transition-all duration-300 active:scale-95 cursor-pointer"
            >
                <Home className="w-4 h-4" />
                Retour au menu principal
            </button>
        </div>
    );
}

export default PlayerIsBan;
