import { Plus } from 'lucide-react';
import {redirect} from "next/navigation";

export default function MobileFab() {
    return (
        <div className="md:hidden fixed right-4 bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] z-50">
            <button
                onClick={() => redirect('/createRoom')}
                aria-label="Créer une partie"
                className="w-14 h-14 bg-purple-600 rounded-full shadow-lg shadow-purple-600/40 flex items-center justify-center text-white active:scale-95 transition"
            >
                <Plus className="w-8 h-8" />
            </button>
        </div>
    );
}