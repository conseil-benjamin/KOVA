import React from 'react';
import { Zap, Clock, Eye, Ghost, ArrowLeftRight } from 'lucide-react';
import { Room } from '@/types/Room';

interface ActiveItems {
    [key: string]: number;
}

interface JokersSectionProps {
    itemsEnabled: boolean;
    setItemsEnabled: (val: boolean) => void;
    activeItems: ActiveItems;
    updateItemUses: (key: string, newValue: number) => void;
    isConsult: boolean;
}

const JokersSection: React.FC<JokersSectionProps> = ({
    itemsEnabled, setItemsEnabled,
    activeItems, updateItemUses, isConsult
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
                        onClick={() => !isConsult && setItemsEnabled(!itemsEnabled)}
                        className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center p-1 ${itemsEnabled ? 'bg-purple-600' : 'bg-slate-700'}`}
                    >
                        <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${itemsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            <div className={`grid grid-cols-2 gap-3 transition-opacity duration-300 ${itemsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>

                {/* Item: Freeze */}
                <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${activeItems.freeze > 0 ? 'bg-blue-500/10 border-blue-500/50' : 'bg-[#13131f] border-white/5 opacity-50'}`}>
                    <div
                        className="flex items-center gap-3 cursor-pointer flex-1"
                        onClick={() => !isConsult && updateItemUses('freeze', activeItems.freeze > 0 ? 0 : 1)}
                    >
                        <div className={`p-2 rounded-lg ${activeItems.freeze > 0 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <div className={`text-sm font-bold ${activeItems.freeze > 0 ? 'text-white' : 'text-slate-400'}`}>Freeze</div>
                            <div className="text-[10px] text-slate-500">Arrête le temps</div>
                        </div>
                    </div>
                    {!isConsult && (
                        <div className="flex items-center gap-2">
                            <button onClick={() => updateItemUses('freeze', Math.max(0, activeItems.freeze - 1))} className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700">-</button>
                            <span className="text-sm font-bold w-4 text-center">{activeItems.freeze}</span>
                            <button onClick={() => updateItemUses('freeze', activeItems.freeze + 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700">+</button>
                        </div>
                    )}
                </div>

                {/* Item: Hint */}
                <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${activeItems.hint > 0 ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-[#13131f] border-white/5 opacity-50'}`}>
                    <div
                        className="flex items-center gap-3 cursor-pointer flex-1"
                        onClick={() => !isConsult && updateItemUses('hint', activeItems.hint > 0 ? 0 : 1)}
                    >
                        <div className={`p-2 rounded-lg ${activeItems.hint > 0 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                            <Eye className="w-4 h-4" />
                        </div>
                        <div>
                            <div className={`text-sm font-bold ${activeItems.hint > 0 ? 'text-white' : 'text-slate-400'}`}>Indice</div>
                            <div className="text-[10px] text-slate-500">Révèle 1 lettre</div>
                        </div>
                    </div>
                    {!isConsult && (
                        <div className="flex items-center gap-2">
                            <button onClick={() => updateItemUses('hint', Math.max(0, activeItems.hint - 1))} className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700">-</button>
                            <span className="text-sm font-bold w-4 text-center">{activeItems.hint}</span>
                            <button onClick={() => updateItemUses('hint', activeItems.hint + 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700">+</button>
                        </div>
                    )}
                </div>

                {/* Item: Ink */}
                <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${activeItems.ink > 0 ? 'bg-pink-500/10 border-pink-500/50' : 'bg-[#13131f] border-white/5 opacity-50'}`}>
                    <div
                        className="flex items-center gap-3 cursor-pointer flex-1"
                        onClick={() => !isConsult && updateItemUses('ink', activeItems.ink > 0 ? 0 : 1)}
                    >
                        <div className={`p-2 rounded-lg ${activeItems.ink > 0 ? 'bg-pink-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                            <Ghost className="w-4 h-4" />
                        </div>
                        <div>
                            <div className={`text-sm font-bold ${activeItems.ink > 0 ? 'text-white' : 'text-slate-400'}`}>Encre</div>
                            <div className="text-[10px] text-slate-500">Cache l'écran</div>
                        </div>
                    </div>
                    {!isConsult && (
                        <div className="flex items-center gap-2">
                            <button onClick={() => updateItemUses('ink', Math.max(0, activeItems.ink - 1))} className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700">-</button>
                            <span className="text-sm font-bold w-4 text-center">{activeItems.ink}</span>
                            <button onClick={() => updateItemUses('ink', activeItems.ink + 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700">+</button>
                        </div>
                    )}
                </div>

                {/* Item: Swap */}
                <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${activeItems.swap > 0 ? 'bg-orange-500/10 border-orange-500/50' : 'bg-[#13131f] border-white/5 opacity-50'}`}>
                    <div
                        className="flex items-center gap-3 cursor-pointer flex-1"
                        onClick={() => !isConsult && updateItemUses('swap', activeItems.swap > 0 ? 0 : 1)}
                    >
                        <div className={`p-2 rounded-lg ${activeItems.swap > 0 ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                            <ArrowLeftRight className="w-4 h-4" />
                        </div>
                        <div>
                            <div className={`text-sm font-bold ${activeItems.swap > 0 ? 'text-white' : 'text-slate-400'}`}>Swap</div>
                            <div className="text-[10px] text-slate-500">Échange scores</div>
                        </div>
                    </div>
                    {!isConsult && (
                        <div className="flex items-center gap-2">
                            <button onClick={() => updateItemUses('swap', Math.max(0, activeItems.swap - 1))} className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700">-</button>
                            <span className="text-sm font-bold w-4 text-center">{activeItems.swap}</span>
                            <button onClick={() => updateItemUses('swap', activeItems.swap + 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700">+</button>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default JokersSection;
