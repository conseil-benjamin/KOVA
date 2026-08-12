import { X } from 'lucide-react';
import { redirect } from 'next/navigation';

interface CreateRoomHeaderProps {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    setIsConsult: (isConsult: boolean) => void;
    isConsult: boolean;
}

const CreateRoomHeader: React.FC<CreateRoomHeaderProps> = ({ isEditing, setIsEditing, setIsConsult, isConsult }) => {
    return (
        <header className="flex-none h-14 md:h-16 pt-safe box-content md:box-border border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-3 md:px-8 z-50 sticky top-0">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <button onClick={() => isEditing ? setIsEditing(false) : isConsult ? setIsConsult(false) : redirect('/')} aria-label="Fermer" className="tap-target shrink-0 flex items-center justify-center hover:bg-white/10 active:bg-white/20 rounded-full transition">
                    <X className="w-5 h-5 text-slate-400" />
                </button>
                <h1 className="text-base md:text-lg font-bold text-white truncate">{isEditing ? 'Modifier la partie' : isConsult ? 'Consultation des règles' : 'Créer une partie'}</h1>
            </div>
        </header>
    );
};

export default CreateRoomHeader;