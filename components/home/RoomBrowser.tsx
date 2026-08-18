import { Room } from '@/types/Room';
import {
    Search,
    Globe,
    Music,
    Film,
    Gamepad2,
    LayoutGrid,
    List,
    Lock,
    Users,
    ChevronRight,
    Info,
    Plus,
    Loader
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { redirect } from 'next/navigation';
import RoomService from '@/services/roomService';

interface RoomBrowserProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    viewMode: string;
    setViewMode: (mode: string) => void;
    rooms: Room[];
}

export default function RoomBrowser({ activeTab, setActiveTab, viewMode, setViewMode, rooms }: RoomBrowserProps) {
    const categories = [
        { id: 'ALL', label: 'Tout', icon: Globe },
        { id: 'MUSIC', label: 'Musique', icon: Music },
        { id: 'CINEMA', label: 'Cinéma', icon: Film },
        { id: 'GAMES', label: 'Jeux Vidéo', icon: Gamepad2 },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [allPacks, setAllPacks] = useState<any[]>([]);
    const [openPacksRoomId, setOpenPacksRoomId] = useState<string | null>(null);
    const packsPopoverRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const roomService = new RoomService();

        const fetchAllPacks = async () => {
            const result = await roomService.getAllPacks();
            if (result?.status === 200) {
                setAllPacks(result.data);
            }
        };
        fetchAllPacks().then(() => setLoading(false));
    }, []);

    /* Ferme la liste des packs au clic en dehors */
    useEffect(() => {
        if (!openPacksRoomId) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (packsPopoverRef.current && !packsPopoverRef.current.contains(e.target as Node)) {
                setOpenPacksRoomId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openPacksRoomId]);

    /* Identifiant stable et jamais undefined (l'API ne renvoie pas toujours _id) */
    const getRoomKey = (room: Room, index: number) => room._id || room.idUrl || `room-${index}`;

    /* Retourne les noms des packs d'une room à partir de leurs ids */
    const getPackNames = (room: Room) => {
        if (!room.packs || !Array.isArray(room.packs)) return [];

        return room.packs.map((packId: string) => {
            const pack = allPacks.find((p: any) => p.id === packId);
            if (!pack) return packId;
            return pack.name?.[room.language] || pack.name?.fr || packId;
        });
    };

    useEffect(() => {
        if (rooms && Array.isArray(rooms)) {
            setFilteredRooms(rooms);
        }
        console.log(rooms);
    }, [rooms]);

    useEffect(() => {
        if (!rooms || !Array.isArray(rooms)) return;

        if (searchQuery === '') {
            setFilteredRooms(rooms);
            return;
        }
        const filtered = rooms.filter((room: Room) => {
            return (room.name.toLowerCase().includes(searchQuery.toLowerCase()) || room.tags.some((tag: string) => tag.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchQuery.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())))
        });
        setFilteredRooms(filtered);
    }, [searchQuery, rooms]);

    useEffect(() => {
        if (!rooms || !Array.isArray(rooms)) return;

        if (activeTab === 'Tout') {
            setFilteredRooms(rooms);
            return;
        }
        const filtered = rooms.filter((room: Room) => {
            return room.tags.some((tag: string) => tag.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(activeTab.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()))
        });
        setFilteredRooms(filtered);
    }, [activeTab, rooms]);

    const joinRoom = (room: Room) => {
        redirect(`/${room.idUrl}`);
    }

    /* Le vide n'a pas la même cause selon qu'on cherche, qu'on filtre, ou qu'il
       n'y a réellement aucune partie : le message et l'action s'y adaptent. */
    const isSearching = searchQuery.trim() !== '';
    const isFiltering = activeTab !== 'Tout';

    return (
        <div className="lg:col-span-6 flex flex-col gap-4 md:gap-6 min-w-0">

            {/* Barre de Recherche & Filtres */}
            <div
                className="bg-[#13131f]/80 backdrop-blur border border-white/5 p-2 rounded-xl flex flex-col md:flex-row gap-2 sticky top-[calc(5rem+env(safe-area-inset-top,0px))] z-40 shadow-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/>
                    <input
                        type="text"
                        placeholder="Chercher une partie, un tag..."
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.label)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${activeTab === cat.label ? 'bg-white text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            <cat.icon className="w-3 h-3"/>
                            {cat.label}
                        </button>
                    ))}
                </div>
                <div className="hidden md:flex border-l border-white/10 pl-2 gap-1">
                    <button onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'text-white bg-white/10' : 'text-slate-500'}`}>
                        <LayoutGrid className="w-4 h-4"/></button>
                    <button onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'text-white bg-white/10' : 'text-slate-500'}`}>
                        <List className="w-4 h-4"/></button>
                </div>
            </div>

            {/* Liste des Rooms */}
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {loading && (
                    <Loader/>
                )}
                {filteredRooms && !loading && filteredRooms.length > 0 &&
                    filteredRooms.map((room: Room, roomIndex: number) => {
                        const roomKey = getRoomKey(room, roomIndex);
                        const isPacksOpen = openPacksRoomId === roomKey;

                        return (
                        <div key={roomKey}
                             className="group bg-[#1a1a24] border border-white/5 rounded-xl transition-all relative shadow-lg">

                            {/* Image Header */}
                            <div
                                onClick={() => joinRoom(room)}
                                className={`h-24 relative overflow-hidden rounded-t-lg cursor-pointer`}> {/* Ajout de overflow-hidden pour les bords arrondis */}
                                {/* L'image de fond */}
                                <img
                                    src={room.packs.length > 1 ? 'https://pub-f804f75e71574b289a0c1d106c20d2cf.r2.dev/packs/multi-packs/3d-question-mark-icons-speech-bubbles-orange-purple-design_84443-56040.avif' : room.backgroundImageUrl}
                                    alt={room.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
                                />

                                {/* Overlay sombre au survol */}
                                <div
                                    className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                                {/* Badges */}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    {room.isPrivate && (
                                        <div
                                            className="bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
                                            <Lock className="w-3 h-3"/> Privé
                                        </div>
                                    )}
                                    <div
                                        className="bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white flex items-center gap-1">
                                        <Users
                                            className="w-3 h-3"/> {room.players && room.players.length + "/" + room.maxPlayers}
                                    </div>
                                </div>
                            </div>

                            {/* Contenu */}
                            <div className="p-4">
                                <div onClick={() => joinRoom(room)} className="flex justify-between items-start mb-2 min-w-0 cursor-pointer">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-white transition truncate">{room.name}</h3>
                                        <p className="text-xs text-slate-500 truncate">{room.pack}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center gap-2 flex-wrap min-w-0">
                                    <div className="flex -space-x-2 items-center min-w-0">
                                    <span
                                        className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded shadow-md whitespace-nowrap">
                                        {room.language === 'fr' ? 'Francais' : room.language === 'en' ? 'English' : room.language.toUpperCase()}
                                    </span>
                                        {/* [...Array(3)].map((_, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border border-[#1a1a24] text-[8px] flex items-center justify-center text-white">
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    )) */}
                                        {/* {room.players > 3 && <div className="w-6 h-6 rounded-full bg-slate-800 border border-[#1a1a24] text-[8px] flex items-center justify-center text-slate-400">+{room.players - 3}</div>} */}
                                    </div>
                                    <div className="relative min-w-0"
                                         ref={isPacksOpen ? packsPopoverRef : null}>
                                        <span
                                            onClick={() => room.packs && room.packs.length > 1 && setOpenPacksRoomId(isPacksOpen ? null : roomKey)}
                                            className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 active:bg-white/25 px-3 py-2 rounded-lg transition flex items-center gap-1 cursor-pointer truncate max-w-[9rem] sm:max-w-none">
                                            {room.packs && room.packs.length > 1 ?
                                                <div className={'flex flex-row items-center justify-center'}>
                                                    <Info className="w-3 h-3"/>
                                                    <span className={'ml-2'}>multi-pack</span>
                                                </div>
                                                : room.packs && room.packs.length === 1 ? getPackNames(room)[0]
                                                    : 'Aucun pack'}
                                        </span>

                                        {/* Liste des packs présents dans la room */}
                                        {isPacksOpen && (
                                            <div
                                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-[min(22rem,calc(100vw-3rem))] bg-[#13131f] border border-white/10 rounded-lg shadow-xl p-3">
                                                <p className="text-[10px] uppercase tracking-wide text-slate-500 font-bold mb-2">
                                                    {room.packs.length} packs
                                                </p>
                                                <ul className={`grid gap-1 max-h-72 overflow-y-auto ${room.packs.length > 6 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                                    {getPackNames(room).map((packName: string, i: number) => (
                                                        <li key={`${roomKey}-${room.packs[i]}-${i}`}
                                                            className="text-xs font-normal leading-snug text-slate-300 bg-white/5 px-2 py-1.5 rounded break-words">
                                                            {packName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => joinRoom(room)}
                                            className="shrink-0 text-xs font-bold text-white bg-white/10 hover:bg-white/20 active:bg-white/25 active:scale-95 px-3 py-2 rounded-lg transition flex items-center gap-1 cursor-pointer whitespace-nowrap">
                                        Rejoindre <ChevronRight className="w-3 h-3"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        );
                    })
                }
            </div>

            {filteredRooms && filteredRooms.length <= 0 && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-white/10 bg-[#13131f]/60 px-6 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                        {isSearching || isFiltering
                            ? <Search className="w-6 h-6 text-slate-500"/>
                            : <Globe className="w-6 h-6 text-purple-400"/>}
                    </div>

                    <div className="space-y-1.5">
                        <p className="font-bold text-white">
                            {isSearching ? 'Aucun résultat'
                                : isFiltering ? `Aucune partie en ${activeTab}`
                                    : 'Aucune partie publique'}
                        </p>
                        <p className="mx-auto max-w-xs text-sm text-slate-500">
                            {isSearching ? `Rien ne correspond à « ${searchQuery} ». Essaie un autre nom ou un tag.`
                                : isFiltering ? 'Change de catégorie, ou lance la première partie de ce thème.'
                                    : "Personne n'a encore lancé de partie. Crée la tienne, les autres te rejoindront."}
                        </p>
                    </div>

                    {isSearching ? (
                        <button onClick={() => setSearchQuery('')}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white active:scale-95 transition cursor-pointer">
                            Effacer la recherche
                        </button>
                    ) : isFiltering && (
                        <button onClick={() => setActiveTab('Tout')}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white active:scale-95 transition cursor-pointer">
                            Voir toutes les parties
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
