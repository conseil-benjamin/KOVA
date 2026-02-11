import React from 'react';
import { Dices, Plus, Check, Search, Volume2 } from 'lucide-react';
import { packs } from './constants';

interface PacksSectionProps {
    selectedPack: string;
    setSelectedPack: (id: string) => void;
    isConsult: boolean;
}

const PacksSection: React.FC<PacksSectionProps> = ({ selectedPack, setSelectedPack, isConsult }) => {
    return (
        <section className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Dices className="w-4 h-4" /> Packs de Questions
                </label>
                <button className="text-xs text-purple-400 hover:text-white transition flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Importer un pack
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {packs.map(pack => (
                    <div
                        key={pack.id}
                        onClick={() => !isConsult && setSelectedPack(pack.name)}
                        className={`
                            relative p-4 rounded-xl border cursor-pointer transition-all duration-200 group overflow-hidden
                            ${selectedPack === pack.name
                                ? 'bg-[#1a1a24] border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                                : 'bg-[#13131f] border-white/5 hover:border-white/20 hover:bg-[#1a1a24]'}
                        `}
                    >
                        {/* Fond Gradient subtil si sélectionné */}
                        {selectedPack === pack.name && <div className={`absolute inset-0 bg-gradient-to-br ${pack.color} opacity-10`}></div>}

                        <div className="flex items-start gap-4 relative z-10">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${pack.color} shadow-lg text-white`}>
                                <pack.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    {pack.name}
                                    {pack.isAudio && <Volume2 className="w-3 h-3 text-cyan-400" />}
                                </h3>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pack.desc}</p>
                                <div className="mt-2 text-[10px] font-mono text-slate-500 bg-black/20 w-fit px-2 py-0.5 rounded">
                                    {pack.count} questions
                                </div>
                            </div>
                            {selectedPack === pack.name && (
                                <div className="bg-purple-500 rounded-full p-1 shadow-lg animate-in zoom-in duration-200">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Bouton Plus de packs */}
                <div className="p-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-white hover:border-white/30 cursor-pointer transition h-full min-h-[100px]">
                    <Search className="w-6 h-6" />
                    <span className="text-sm font-medium">Parcourir la boutique...</span>
                </div>
            </div>
        </section>
    );
};

export default PacksSection;
