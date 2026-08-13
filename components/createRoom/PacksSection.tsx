import React from 'react';
import { Dices, Check, Search, Volume2 } from 'lucide-react';

interface PacksSectionProps {
    selectedPack: string[] | undefined;
    setSelectedPack: (id: string) => void;
    isConsult: boolean;
    setShowModalMorePacks: (show: boolean) => void;
    packs: any;
    language: string;
    onlySelectedPacks?: boolean;
}

const PacksSection: React.FC<PacksSectionProps> = ({ selectedPack, setSelectedPack, isConsult, setShowModalMorePacks, packs, language, onlySelectedPacks }) => {
    return (
        <section className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Dices className="w-4 h-4" /> {!onlySelectedPacks ? 'Packs de Questions' : 'Packs sélectionnés'} ({selectedPack?.length}/{packs.length})
                </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {packs.map((pack: any) => {
                    const isSelected = selectedPack?.includes(pack.id);
                    return isSelected && (
                        <div
                            key={pack.id}
                            onClick={() => !isConsult && setSelectedPack(pack.id)}
                            className={`
                                rounded-xl border transition-all duration-200 overflow-hidden group
                                ${isConsult ? 'cursor-default' : 'cursor-pointer'}
                                ${isSelected
                                    ? 'bg-[#1a1a24] border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                                    : 'bg-[#13131f] border-white/5 hover:border-white/20 hover:bg-[#1a1a24]'}
                            `}
                        >
                            {/* Cover */}
                            <div className={`relative w-full aspect-video bg-gradient-to-br ${pack.color || 'from-slate-700 to-slate-800'}`}>
                                {pack.imageUrl && (
                                    <img src={pack.imageUrl} alt={pack.name[language]} className="absolute inset-0 w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                {isSelected && (
                                    <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1 shadow-lg animate-in zoom-in duration-200">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                {pack.isAudio && (
                                    <div className="absolute top-2 left-2 bg-black/60 rounded-full p-1.5">
                                        <Volume2 className="w-3 h-3 text-cyan-400" />
                                    </div>
                                )}
                            </div>

                            {/* Infos */}
                            <div className="p-3">
                                <h3 className="font-bold text-white text-sm truncate">{pack.name[language]}</h3>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{pack.description?.[language]}</p>
                                <div className="mt-2 text-[10px] font-mono text-slate-300 bg-white/10 w-fit px-2 py-0.5 rounded">
                                    {pack.questionsCount} questions
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Bouton Plus de packs */}
                {!isConsult && (
                    <div onClick={() => setShowModalMorePacks(true)} className="rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-white hover:border-white/30 cursor-pointer transition min-h-[160px]">
                        <Search className="w-6 h-6" />
                        <span className="text-sm font-medium text-center px-2">Choisirs vos packs</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PacksSection;
