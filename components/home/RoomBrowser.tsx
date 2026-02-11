import { Room } from '@/types/Room';
import { Search, Globe, Music, Film, Gamepad2, LayoutGrid, List, Lock, Users, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

interface RoomBrowserProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    viewMode: string;
    setViewMode: (mode: string) => void;
    rooms: any;
}

export default function RoomBrowser({ activeTab, setActiveTab, viewMode, setViewMode, rooms }: RoomBrowserProps) {

    const categories = [
        { id: 'ALL', label: 'Tout', icon: Globe },
        { id: 'MUSIC', label: 'Musique', icon: Music },
        { id: 'CINEMA', label: 'Cinéma', icon: Film },
        { id: 'GAMES', label: 'Jeux Vidéo', icon: Gamepad2 },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRooms, setFilteredRooms] = useState(rooms);

    useEffect(() => {
        if (rooms) {
            setFilteredRooms(rooms);
        }
        console.log(rooms);
    }, [rooms]);

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredRooms(rooms);
            return;
        }
        const filtered = rooms.filter((room: Room) => {
            return room.name.toLowerCase().includes(searchQuery.toLowerCase())

            /*    room.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                room.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
                */
        });
        setFilteredRooms(filtered);
    }, [searchQuery]);

    useEffect(() => {
        if (activeTab === 'ALL') {
            setFilteredRooms(rooms);
            return;
        }
        const filtered = rooms.filter((room: Room) => {
            return room.category.toLowerCase() === activeTab.toLowerCase();
        });
        setFilteredRooms(filtered);
    }, [activeTab]);

    const joinRoom = (room: Room) => {
        redirect(`/${room.idUrl}`);
    }

    return (
        <div className="lg:col-span-6 flex flex-col gap-6">

            {/* Barre de Recherche & Filtres */}
            <div className="bg-[#13131f]/80 backdrop-blur border border-white/5 p-2 rounded-xl flex flex-col md:flex-row gap-2 sticky top-20 z-40 shadow-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Chercher une room, un tag..."
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${activeTab === cat.id ? 'bg-white text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            <cat.icon className="w-3 h-3" />
                            {cat.label}
                        </button>
                    ))}
                </div>
                <div className="hidden md:flex border-l border-white/10 pl-2 gap-1">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'text-white bg-white/10' : 'text-slate-500'}`}><LayoutGrid className="w-4 h-4" /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'text-white bg-white/10' : 'text-slate-500'}`}><List className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Liste des Rooms */}
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {filteredRooms.map((room: Room) => (
                    <div key={room._id} className="group bg-[#1a1a24] hover:bg-[#20202e] border border-white/5 hover:border-purple-500/30 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer relative shadow-lg">

                        {/* Image Header */}
                        <div className={`h-24 relative overflow-hidden rounded-t-lg`}> {/* Ajout de overflow-hidden pour les bords arrondis */}
                            {/* L'image de fond */}
                            <img
                                src={room.backgroundImageUrl || 'https://votre-image-par-defaut.jpg'}
                                alt={room.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Overlay sombre au survol */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                            {/* Badges */}
                            <div className="absolute top-2 right-2 flex gap-2">
                                {room.isPrivate && (
                                    <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Privé
                                    </div>
                                )}
                                <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
                                    <Users className="w-3 h-3" /> {room.players.length + "/" + room.maxPlayers}
                                </div>
                            </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-purple-400 transition">{room.name}</h3>
                                    <p className="text-xs text-slate-500">{room.pack}</p>
                                </div>
                                {/* room.status === 'playing' ? (
                                    <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">EN JEU ({room.round})</span>
                                ) : (
                                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">LOBBY</span>
                                ) */}
                            </div>

                            <div className="flex gap-2 mt-4">
                                {/*room.tags.map(tag => (
                                    <span key={tag} className="text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded">#{tag}</span>
                                ))}*/}
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    {/* [...Array(3)].map((_, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border border-[#1a1a24] text-[8px] flex items-center justify-center text-white">
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    )) */}
                                    {/* {room.players > 3 && <div className="w-6 h-6 rounded-full bg-slate-800 border border-[#1a1a24] text-[8px] flex items-center justify-center text-slate-400">+{room.players - 3}</div>} */}
                                </div>
                                <button onClick={() => joinRoom(room)} className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                                    Rejoindre <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
