import { X } from 'lucide-react';
import { redirect } from 'next/navigation';

interface CreateRoomHeaderProps {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

const CreateRoomHeader: React.FC<CreateRoomHeaderProps> = ({ isEditing, setIsEditing }) => {
    return (
        <header className="flex-none h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 z-50 sticky top-0">
            <div className="flex items-center gap-3">
                <button onClick={() => isEditing ? setIsEditing(false) : redirect('/')} className="p-2 hover:bg-white/10 rounded-full transition">
                    <X className="w-5 h-5 text-slate-400" />
                </button>
                <h1 className="text-lg font-bold text-white">{isEditing ? 'Modifier la partie' : 'Créer une partie'}</h1>
            </div>
            <div className="text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 hidden md:block">
                Serveur: Europe (Paris)
            </div>
        </header>
    );
};

export default CreateRoomHeader;