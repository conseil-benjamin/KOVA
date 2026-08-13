import React from 'react';

interface WaitingForHostProps {
    isCreator?: boolean;
    /** Actions de lobby affichées au centre de l'écran sur mobile : là, le
     *  header n'a qu'un bouton menu, et « Rejoindre »/« Lancer » y étaient
     *  invisibles tant qu'on n'ouvrait pas les trois barres. */
    actions?: React.ReactNode;
}

const WaitingForHost = ({ isCreator, actions }: WaitingForHostProps) => (
    <div className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto overscroll-contain px-5 py-6"
         style={{ background: 'rgba(10,10,18,0.9)', backdropFilter: 'blur(4px)' }}>
        <div className="flex w-full max-w-xs flex-col items-center gap-5 text-center">

            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(29,158,117,0.15)', border: '1.5px solid rgba(93,202,165,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
            </div>

            <div>
                <p style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                    {isCreator ? 'Prêt à lancer ?' : 'En attente du lancement'}
                </p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                    {isCreator
                        ? 'Tu es le maître de jeu : lance la partie quand tout le monde est là.'
                        : "Le maître de jeu n'a pas encore lancé la partie."}
                </p>
            </div>

            {/* Sur desktop ces mêmes actions sont déjà dans le header. */}
            {actions && <div className="w-full md:hidden">{actions}</div>}

        </div>
    </div>
)

export default WaitingForHost;
