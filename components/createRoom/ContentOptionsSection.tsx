import React from 'react';
import { Volume2, Ghost } from 'lucide-react';

interface ContentOptionsSectionProps {
    enableBlindTest: boolean;
    setEnableBlindTest: (val: boolean) => void;
    enableShowWrongAnswers: boolean;
    setEnableShowWrongAnswers: (val: boolean) => void;
    enableNSFW: boolean;
    setEnableNSFW: (val: boolean) => void;
    enableAbbreviations: boolean;
    setEnableAbbreviations: (val: boolean) => void;
    isConsult: boolean;
}

const ContentOptionsSection: React.FC<ContentOptionsSectionProps> = ({
    enableBlindTest, setEnableBlindTest,
    enableShowWrongAnswers, setEnableShowWrongAnswers,
    enableNSFW, setEnableNSFW,
    enableAbbreviations, setEnableAbbreviations, isConsult
}) => {
    return (
        <section className="bg-[#13131f] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${enableBlindTest ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                        <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Mode Blind Test</h3>
                        <p className="text-xs text-slate-400">Inclure des questions audio (musiques, répliques).</p>
                    </div>
                </div>
                <button
                    onClick={() => !isConsult && setEnableBlindTest(!enableBlindTest)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 flex items-center p-1 ${enableBlindTest ? 'bg-cyan-500' : 'bg-slate-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${enableBlindTest ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>

            <div className="h-px bg-white/5"></div>

            <div className="flex items-center justify-between opacity-50 hover:opacity-100 transition">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${enableNSFW ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-500'}`}>
                        <Ghost className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Contenu Adulte (NSFW)</h3>
                        <p className="text-xs text-slate-400">Autoriser les packs avec du contenu sensible.</p>
                    </div>
                </div>
                <button
                    onClick={() => !isConsult && setEnableNSFW(!enableNSFW)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 flex items-center p-1 ${enableNSFW ? 'bg-red-500' : 'bg-slate-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${enableNSFW ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>

            <div className="h-px bg-white/5"></div>

            <div className="flex items-center justify-between opacity-50 hover:opacity-100 transition">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${enableShowWrongAnswers ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-500'}`}>
                        <Ghost className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Réponses</h3>
                        <p className="text-xs text-slate-400">Afficher les mauvaises réponses des joueurs.</p>
                    </div>
                </div>
                <button
                    onClick={() => !isConsult && setEnableShowWrongAnswers(!enableShowWrongAnswers)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 flex items-center p-1 ${enableShowWrongAnswers ? 'bg-red-500' : 'bg-slate-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${enableShowWrongAnswers ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>

            <div className="h-px bg-white/5"></div>

            <div className="flex items-center justify-between opacity-50 hover:opacity-100 transition">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${enableAbbreviations ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-500'}`}>
                        <Ghost className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Raccourcis</h3>
                        <p className="text-xs text-slate-400">Autoriser les abréviations.</p>
                    </div>
                </div>
                <button
                    onClick={() => !isConsult && setEnableAbbreviations(!enableAbbreviations)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 flex items-center p-1 ${enableAbbreviations ? 'bg-red-500' : 'bg-slate-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${enableAbbreviations ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>
        </section>
    );
};

export default ContentOptionsSection;
