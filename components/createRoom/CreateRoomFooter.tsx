import React from 'react';
import { Play, Pencil, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';

interface CreateRoomFooterProps {
    launchRoom: () => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    setIsConsult: (isConsult: boolean) => void;
    isConsult: boolean;
    estimateTime: number;
}

const CreateRoomFooter: React.FC<CreateRoomFooterProps> = ({ launchRoom, isEditing, setIsEditing, setIsConsult, isConsult, estimateTime }) => {
    return (
        <footer className="sticky bottom-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-t border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] z-50">
            <div className="max-w-6xl mx-auto flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between md:gap-4">
                {/* Durée estimée : une ligne au-dessus du bouton sur mobile,
                    bloc sur deux lignes à gauche à partir de md. */}
                <div
                    title="Durée estimée de la partie"
                    className="flex items-center gap-2 md:flex-col md:items-start md:gap-0"
                >
                    <Clock className="w-4 h-4 shrink-0 text-purple-400 md:hidden" aria-hidden="true" />
                    <span className="text-xs text-slate-400">Total estimé</span>
                    <span className="text-sm font-bold text-white whitespace-nowrap tabular-nums">~{estimateTime.toFixed(0)} min</span>
                </div>

                <div className="flex items-center gap-3 justify-end min-w-0">
                    <button onClick={() => isConsult ? setIsConsult(false) : isEditing ? setIsEditing(false) : redirect('/')} className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:text-white transition hidden md:block">
                        {isConsult ? 'Retour' : isEditing ? 'Annuler' : 'Retour'}
                    </button>
                    {!isConsult && (
                        <button onClick={launchRoom} className="flex-1 md:flex-none px-4 sm:px-8 py-3.5 md:py-3 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 to-indigo-600 md:hover:scale-105 active:scale-95 transition shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2">
                            {isEditing ? <Pencil className="w-5 h-5 fill-current shrink-0" /> : <Play className="w-5 h-5 fill-current shrink-0" />}
                            <span className="truncate">{isEditing ? 'MODIFIER LA PARTIE' : 'CRÉER LA PARTIE'}</span>
                        </button>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default CreateRoomFooter;
