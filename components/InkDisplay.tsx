import React from "react";

interface InkDisplayProps {
    attackerName?: string;
}

const InkDisplay: React.FC<InkDisplayProps> = ({ attackerName }) => {
    return (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden flex flex-col items-center justify-center">

            {/* Effet "Tunnel Vision" sombre : transparent au centre, très opaque sur les bords */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.9)_60%,rgba(0,0,0,1)_100%)] backdrop-blur-[3px] animate-[pulse_4s_ease-in-out_infinite]" />

            {/* Bordures d'écran assombries pour renforcer l'effet d'étouffement */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent opacity-90" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent opacity-90" />

            {/* Notification UI très sobre (Glassmorphism) */}
            <div className="relative z-10 -mt-32">
                <div className="bg-black/50 border border-purple-500/20 backdrop-blur-md px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.1)] flex flex-col items-center">
                    <span className="text-gray-200 font-semibold text-lg tracking-widest uppercase flex items-center gap-3">
                        {/* Petite icône minimaliste type "œil barré" ou "alerte" */}
                        <svg className="w-5 h-5 text-purple-400 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                        Vision Obscurcie
                    </span>

                    {attackerName && (
                        <div className="mt-2 text-sm text-gray-400 font-medium">
                            Ciblé par <span className="text-purple-300">{attackerName}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InkDisplay;
