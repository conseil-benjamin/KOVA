import React from 'react';
import { Check, Gauge } from 'lucide-react';
import { difficulties } from './constants';

interface DifficultySectionProps {
    selectedDifficulties: string[];
    toggleDifficulty: (id: string) => void;
    isConsult: boolean;
}

/* Tailwind ne peut pas générer les classes construites dynamiquement,
   on les écrit donc en toutes lettres par difficulté. */
const styles: { [key: string]: { border: string; icon: string; box: string } } = {
    emerald: {
        border: 'border-emerald-500 bg-[#1a1a24] shadow-[0_0_20px_rgba(16,185,129,0.15)]',
        icon: 'bg-emerald-500/20 text-emerald-400',
        box: 'bg-emerald-500 border-emerald-500',
    },
    amber: {
        border: 'border-amber-500 bg-[#1a1a24] shadow-[0_0_20px_rgba(245,158,11,0.15)]',
        icon: 'bg-amber-500/20 text-amber-400',
        box: 'bg-amber-500 border-amber-500',
    },
    red: {
        border: 'border-red-500 bg-[#1a1a24] shadow-[0_0_20px_rgba(239,68,68,0.15)]',
        icon: 'bg-red-500/20 text-red-400',
        box: 'bg-red-500 border-red-500',
    },
};

const DifficultySection: React.FC<DifficultySectionProps> = ({ selectedDifficulties, toggleDifficulty, isConsult }) => {
    return (
        <section className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Gauge className="w-4 h-4" /> Niveaux de difficulté ({selectedDifficulties.length}/{difficulties.length})
                </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {difficulties.map(difficulty => {
                    const isSelected = selectedDifficulties.includes(difficulty.id);
                    const style = styles[difficulty.color];

                    return (
                        <div
                            key={difficulty.id}
                            role="checkbox"
                            aria-checked={isSelected}
                            onClick={() => !isConsult && toggleDifficulty(difficulty.id)}
                            className={`
                                rounded-xl border p-3 flex items-center gap-3 transition-all duration-200
                                ${isConsult ? 'cursor-default' : 'cursor-pointer'}
                                ${isSelected ? style.border : 'bg-[#13131f] border-white/5 hover:border-white/20 hover:bg-[#1a1a24]'}
                            `}
                        >
                            <div className={`p-2 rounded-lg shrink-0 ${isSelected ? style.icon : 'bg-slate-800 text-slate-500'}`}>
                                <difficulty.icon className="w-5 h-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-white text-sm">{difficulty.label}</h3>
                                <p className="text-xs text-slate-400 leading-snug">{difficulty.desc}</p>
                            </div>

                            <div className={`w-5 h-5 shrink-0 rounded border flex items-center justify-center transition-colors ${isSelected ? style.box : 'border-white/20'}`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedDifficulties.length === 0 && (
                <p className="text-xs text-red-400">Sélectionnez au moins un niveau de difficulté.</p>
            )}
        </section>
    );
};

export default DifficultySection;
