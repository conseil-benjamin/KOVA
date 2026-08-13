import { Check, PackageSearch, Search, Volume2, X } from "lucide-react";
import { useState } from "react";

const SearchForMorePacks = ({ selectedPack, setSelectedPack, packs, language, onClose }: { selectedPack: string[] | undefined; setSelectedPack: (pack: string) => void; packs: any; language: string; onClose?: () => void }) => {
    const [search, setSearch] = useState('');

    const filteredPacks = packs.filter((pack: any) => pack.name[language].toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 p-4 pb-3 md:p-6 md:pb-4 border-b border-white/10">
                <div className="min-w-0">
                    <h1 className="text-lg md:text-xl font-bold text-white">Choisissez vos packs</h1>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">{selectedPack?.length} pack{selectedPack && selectedPack?.length > 1 ? 's' : ''} sélectionné{selectedPack && selectedPack?.length > 1 ? 's' : ''} sur {packs.length}</p>
                </div>
                {onClose && (
                    <button onClick={onClose} aria-label="Fermer" className="tap-target shrink-0 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Search bar */}
            <div className="px-4 md:px-6 py-3 md:py-4">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Rechercher un pack..."
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 md:px-6 pb-4 md:pb-6">
                {filteredPacks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {filteredPacks.map((pack: any) => {
                            const isSelected = selectedPack?.includes(pack.id);
                            return (
                                <div
                                    key={pack.id}
                                    onClick={() => setSelectedPack(pack.id)}
                                    className={`
                                        rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden group
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
                                            <span>{pack.questionsCount} questions</span>
                                            <span> - {pack.plays} joué</span>
                                            <span> - {pack.likes} favoris</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500 py-16">
                        <PackageSearch className="w-10 h-10" />
                        <p className="text-sm">Aucun pack ne correspond à "{search}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchForMorePacks;
