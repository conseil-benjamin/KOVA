import React from 'react';
import { Zap, Clock, Eye, Ghost } from 'lucide-react';

interface ActiveItems {
    hint: boolean;
    freeze: boolean;
    ink: boolean;
    swap: boolean;
}

interface JokersSectionProps {
    itemsEnabled: boolean;
    setItemsEnabled: (val: boolean) => void;
    activeItems: ActiveItems;
    toggleItem: (key: keyof ActiveItems) => void;
}

const JokersSection: React.FC<JokersSectionProps> = ({
    itemsEnabled, setItemsEnabled,
    activeItems, toggleItem
}) => {
    return (
        <section className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Jokers & Bonus
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{itemsEnabled ? 'Activés' : 'Désactivés'}</span>
                    <button
                        onClick={() => setItemsEnabled(!itemsEnabled)}
                        className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center p-1 ${itemsEnabled ? 'bg-purple-600' : 'bg-slate-700'}`}
                    >
                        <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${itemsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            <div className={`grid grid-cols-2 gap-3 transition-opacity duration-300 ${itemsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>

                {/* Item: Freeze */}
                <div onClick={() => toggleItem('freeze')} className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${activeItems.freeze ? 'bg-blue-500/10 border-blue-500/50' : 'bg-[#13131f] border-white/5 opacity-50'}`}>
                    <div className={`p-2 rounded-lg ${activeItems.freeze ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                        <Clock className="w-4 h-4" />
                    </div>
                    <div>
                        <div className={`text-sm font-bold ${activeItems.freeze ? 'text-white' : 'text-slate-400'}`}>Freeze</div>
                        <div className="text-[10px] text-slate-500">Arrête le temps</div>
                    </div>
                </div>

                {/* Item: Hint */}
                <div onClick={() => toggleItem('hint')} className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${activeItems.hint ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-[#13131f] border-white/5 opacity-50'}`}>
                    <div className={`p-2 rounded-lg ${activeItems.hint ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                        <Eye className="w-4 h-4" />
                    </div>
                    <div>
                        <div className={`text-sm font-bold ${activeItems.hint ? 'text-white' : 'text-slate-400'}`}>Indice</div>
                        <div className="text-[10px] text-slate-500">Révèle 1 lettre</div>
                    </div>
                </div>

                {/* Item: Ink */}
                <div onClick={() => toggleItem('ink')} className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${activeItems.ink ? 'bg-pink-500/10 border-pink-500/50' : 'bg-[#13131f] border-white/5 opacity-50'}`}>
                    <div className={`p-2 rounded-lg ${activeItems.ink ? 'bg-pink-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                        <Ghost className="w-4 h-4" />
                    </div>
                    <div>
                        <div className={`text-sm font-bold ${activeItems.ink ? 'text-white' : 'text-slate-400'}`}>Encre</div>
                        <div className="text-[10px] text-slate-500">Cache l'écran</div>
                    </div>
                </div>

                {/* Item: Swap */}
                <div onClick={() => toggleItem('swap')} className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${activeItems.swap ? 'bg-orange-500/10 border-orange-500/50' : 'bg-[#13131f] border-white/5 opacity-50'}`}>
                    <div className={`p-2 rounded-lg ${activeItems.swap ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                        <Zap className="w-4 h-4" />
                    </div>
                    <div>
                        <div className={`text-sm font-bold ${activeItems.swap ? 'text-white' : 'text-slate-400'}`}>Swap</div>
                        <div className="text-[10px] text-slate-500">Échange scores</div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default JokersSection;
