import { Settings, Languages } from 'lucide-react';

interface RoomNameSectionProps {
    roomName: string;
    setRoomName: (name: string) => void;
    language: 'fr' | 'en';
    setLanguage: (lang: 'fr' | 'en') => void;
}

const RoomNameSection: React.FC<RoomNameSectionProps> = ({ roomName, setRoomName, language, setLanguage }) => {
    return (
        <section className="space-y-4">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4" /> Configuration Générale
            </label>
            <div className="space-y-4">
                <div className="bg-[#13131f] border border-white/5 rounded-2xl p-1">
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="w-full bg-transparent p-4 text-xl font-bold text-white placeholder:text-slate-600 focus:outline-none"
                        placeholder="Nom de la salle..."
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setLanguage('fr')}
                        className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${language === 'fr'
                                ? 'bg-indigo-500/20 border-indigo-500 text-white'
                                : 'bg-[#13131f] border-white/5 text-slate-400 hover:bg-white/5'
                            }`}
                    >
                        <span className="text-xl">🇫🇷</span>
                        <span className="font-bold">Français</span>
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${language === 'en'
                                ? 'bg-indigo-500/20 border-indigo-500 text-white'
                                : 'bg-[#13131f] border-white/5 text-slate-400 hover:bg-white/5'
                            }`}
                    >
                        <span className="text-xl">🇬🇧</span>
                        <span className="font-bold">English</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default RoomNameSection;
