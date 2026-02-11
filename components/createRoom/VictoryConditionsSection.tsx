import React from 'react';
import { Trophy } from 'lucide-react';

interface VictoryConditionsSectionProps {
    scoreToWin: number;
    setScoreToWin: (val: number) => void;
    timePerRound: number;
    setTimePerRound: (val: number) => void;
    maxPlayers: number;
    setMaxPlayers: (val: number) => void;
    isConsult: boolean;
}

const VictoryConditionsSection: React.FC<VictoryConditionsSectionProps> = ({
    scoreToWin, setScoreToWin,
    timePerRound, setTimePerRound,
    maxPlayers, setMaxPlayers, isConsult
}) => {
    return (
        <section className="bg-[#13131f] border border-white/5 rounded-2xl p-6 space-y-8">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-6">
                <Trophy className="w-4 h-4" /> Conditions de Victoire
            </label>

            {/* Score */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">Score à atteindre</span>
                    <span className="text-purple-400 font-bold font-mono">{scoreToWin.toLocaleString()} pts</span>
                </div>
                <input
                    type="range" min="50" max="500" step="10" disabled={isConsult}
                    value={scoreToWin} onChange={(e) => setScoreToWin(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <p className="text-[10px] text-slate-500">Environ {Math.ceil(scoreToWin / 1000)} minutes de jeu.</p>
            </div>

            {/* Temps */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">Temps par question</span>
                    <span className="text-blue-400 font-bold font-mono">{timePerRound} sec</span>
                </div>
                <input
                    type="range" min="5" max="30" step="1" disabled={isConsult}
                    value={timePerRound} onChange={(e) => setTimePerRound(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>

            {/* Joueurs Max */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">Joueurs Max</span>
                    <span className="text-green-400 font-bold font-mono">{maxPlayers}</span>
                </div>
                <input
                    type="range" min="2" max="50" step="1" disabled={isConsult}
                    value={maxPlayers} onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
            </div>
        </section>
    );
};

export default VictoryConditionsSection;
