import { Plus } from 'lucide-react';

export default function MobileFab() {
    return (
        <div className="md:hidden fixed bottom-6 right-6 z-50">
            <button className="w-14 h-14 bg-purple-600 rounded-full shadow-lg shadow-purple-600/40 flex items-center justify-center text-white">
                <Plus className="w-8 h-8" />
            </button>
        </div>
    );
}