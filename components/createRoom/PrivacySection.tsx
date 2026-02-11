import React from 'react';
import { Lock, Globe } from 'lucide-react';

interface PrivacySectionProps {
    isPrivate: boolean;
    setIsPrivate: (val: boolean) => void;
    isConsult: boolean;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({ isPrivate, setIsPrivate, isConsult }) => {
    return (
        <section className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {isPrivate ? <Lock className="w-5 h-5 text-red-400" /> : <Globe className="w-5 h-5 text-green-400" />}
                <div className="flex flex-col">
                    <span className="font-bold text-sm text-white">{isPrivate ? 'Partie Privée' : 'Partie Publique'}</span>
                    <span className="text-[10px] text-slate-500">{isPrivate ? 'Non visible dans le lobby' : 'Visible dans le lobby'}</span>
                </div>
            </div>
            <button disabled={isConsult}
                onClick={() => setIsPrivate(!isPrivate)}
                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded transition text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPrivate ? 'Passer en public' : 'Passer en privé'}
            </button>
        </section>
    );
};

export default PrivacySection;
