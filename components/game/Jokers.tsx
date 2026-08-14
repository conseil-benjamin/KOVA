import React from "react";
import {ArrowRightLeft, Eye, Ghost} from "lucide-react";

interface JokersProps {
    jokers: { name: string; useLeft: number }[];
    handleUseJoker: (item: string) => void;
    activesItems: { id: string; maxUses: number }[] | any;
    itemsEnabled: boolean;
}

const getJokerIcon = (name: string) => {
    switch (name) {
        // `w-4 h-4` ne s'applique pas à un span (inline) : "x2" gardait la taille
        // du texte hérité et gonflait le bouton par rapport aux icônes lucide.
        // flex + leading-none le ramène au même carré de 16px qu'elles.
        case "double": return <span className={'w-4 h-4 flex items-center justify-center text-[11px] font-black leading-none text-green-500 group-hover:text-green-300 transition-colors'}>x2</span>;
        case "ink": return <Ghost className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />;
        case "swap": return <ArrowRightLeft className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" />;
        default: return <Eye className="w-4 h-4 text-pink-400" />;
    }
};

const Jokers: React.FC<JokersProps> = ({ jokers, handleUseJoker, activesItems, itemsEnabled }) => {
    // Jokers activés dans la configuration de la salle. `hint` est exclu : il
    // s'utilise pendant la question (voir GameArea), pas depuis ce panneau.
    const enabledInRoom: string[] = Array.isArray(activesItems)
        ? activesItems
            .filter((item) => item?.id !== "hint" && (item?.maxUses ?? 0) > 0)
            .map((item) => item.id)
        : Object.entries(activesItems ?? {})
            .filter(([name, uses]) => name !== "hint" && Number(uses) > 0)
            .map(([name]) => name);

    // Ce que le joueur possède réellement, parmi ce que la salle autorise.
    const visibleJokers = (jokers ?? []).filter((item) => enabledInRoom.includes(item.name));

    // Jokers coupés pour la partie : pas de titre orphelin.
    if (!itemsEnabled) return null;

    return (
        <>
            <p className={'flex justify-center items-center text-center px-4 mt-6 md:mt-10 text-sm md:text-base text-slate-300'}>Jokers à utiliser pour la prochaine question :</p>

            {visibleJokers.length > 0 ? (
                <div className="flex flex-row flex-wrap justify-center items-center gap-3 z-20 px-3 mt-4 md:mt-8 md:gap-4">
                    {visibleJokers.map((item) => {
                        const isDepleted = item.useLeft === 0;

                        return (
                            <button
                                key={item.name}
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
            ) : (
                <p className="mt-3 px-4 text-center text-xs text-slate-500 italic">
                    {enabledInRoom.length === 0
                        ? "Aucun joker n'est activé pour cette partie."
                        : "Tu n'as aucun joker à utiliser."}
                </p>
            )}
        </>
    );
};

export default Jokers;
