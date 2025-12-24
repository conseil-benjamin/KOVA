import React from 'react';
import { Settings } from 'lucide-react';

interface RoomNameSectionProps {
    roomName: string;
    setRoomName: (name: string) => void;
}

const RoomNameSection: React.FC<RoomNameSectionProps> = ({ roomName, setRoomName }) => {
    return (
        <section className="space-y-4">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4" /> Configuration Générale
            </label>
            <div className="bg-[#13131f] border border-white/5 rounded-2xl p-1">
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full bg-transparent p-4 text-xl font-bold text-white placeholder:text-slate-600 focus:outline-none"
                    placeholder="Nom de la salle..."
                />
            </div>
        </section>
    );
};

export default RoomNameSection;
