import React from "react";
import { ArrowRightLeft, Eye, Music, Timer } from "lucide-react";

interface JokersProps {
    jokers: { name: string; useLeft: number }[];
    handleUseJoker: (item: string) => void;
    activesItems: { id: string; maxUses: number }[] | any;
    itemsEnabled: boolean;
}

const getJokerIcon = (name: string) => {
    switch (name) {
        case "hint": return <Eye className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" />;
        case "freeze": return <Timer className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />;
        case "ink": return <Music className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />;
        case "swap": return <ArrowRightLeft className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" />;
        default: return <Eye className="w-4 h-4 text-pink-400" />;
    }
};

const Jokers: React.FC<JokersProps> = ({ jokers, handleUseJoker, activesItems, itemsEnabled }) => {
    return (
        <>
            {itemsEnabled && (
                <div className="flex justify-center items-center gap-3 z-20 absolute bottom-4 left-4 flex-col md:static md:flex-row md:mt-8 md:gap-4">
                    {jokers && jokers.map((item, index) => {
                        // Vérification si le joker est actif
                        const isActive = Array.isArray(activesItems)
                            ? (activesItems.find(a => a.id === item.name)?.maxUses ?? 0) > 0
                            : (activesItems?.[item.name] ?? 0) > 0;

                        const isHintJoker = item.name === "hint";

                        const isDepleted = item.useLeft === 0;

                        return (isActive && !isHintJoker) && (
                            <button
                                key={index}
                                disabled={isDepleted}
                                onClick={() => handleUseJoker(item.name)}
                                className={`
                            group relative flex items-center gap-3 px-4 py-2.5 rounded-xl
                            bg-white/5 border border-white/10 backdrop-blur-md
                            transition-all duration-300 ease-out
                            ${!isDepleted
                                    ? "hover:bg-white/10 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] hover:-translate-y-1 active:translate-y-0 active:scale-95 cursor-pointer"
                                    : "opacity-40 grayscale cursor-not-allowed"}
                        `}
                            >
                                {/* Icône avec son fond subtil */}
                                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                                    {getJokerIcon(item.name)}
                                </div>

                                {/* Nom du joker */}
                                <span className="font-bold text-sm tracking-wide capitalize bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                            {item.name}
                        </span>

                                {/* Badge de quantité (Notification style) */}
                                <div className={`
                            absolute -top-2 -right-2 flex items-center justify-center 
                            min-w-[20px] h-[20px] px-1.5 rounded-full text-[10px] font-black
                            border border-black/50 shadow-md
                            ${!isDepleted
                                    ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white"
                                    : "bg-gray-600 text-gray-300"}
                        `}>
                                    {item.useLeft}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default Jokers;