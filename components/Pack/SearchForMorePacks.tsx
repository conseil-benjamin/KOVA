import { Check, Volume2 } from "lucide-react";
import { packs } from "../createRoom/constants";
import { useState } from "react";

const SearchForMorePacks = ({ selectedPack, setSelectedPack }: { selectedPack: string; setSelectedPack: (pack: string) => void }) => {
    const [search, setSearch] = useState('');

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold text-white">Rechercher des packs</h1>

            <div className="py-2">
                <input
                    type="text"
                    placeholder="Rechercher un pack..."
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
                {packs.filter(pack => pack.name.toLowerCase().includes(search.toLowerCase())).map(pack => (
                    <div
                        key={pack.id}
                        onClick={() => setSelectedPack(pack.name)}
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
            </div>
        </div>
    );
};

export default SearchForMorePacks;