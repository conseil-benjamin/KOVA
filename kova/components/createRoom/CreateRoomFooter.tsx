import React from 'react';
import { Play } from 'lucide-react';
import { redirect } from 'next/navigation';

interface CreateRoomFooterProps {
    selectedPackName: string | undefined;
}

const CreateRoomFooter: React.FC<CreateRoomFooterProps> = ({ selectedPackName }) => {
    return (
        <footer className="sticky bottom-0 bg-[#0a0a0f]/80 backdrop-blur-xl border-t border-white/10 p-4 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                <div className="hidden md:flex flex-col">
                    <span className="text-xs text-slate-400">Total estimé</span>
                    <span className="text-sm font-bold text-white">~25 min • {selectedPackName}</span>
                </div>

                <div className="flex items-center gap-3 flex-1 md:flex-none justify-end">
                    <button onClick={() => redirect('/')} className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:text-white transition hidden md:block">
                        Annuler
                    </button>
                    <button className="flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 active:scale-95 transition shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2">
                        <Play className="w-5 h-5 fill-current" />
                        LANCER LA PARTIE
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default CreateRoomFooter;
