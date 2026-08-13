import React, { useState } from 'react';
import { Crown, MoreVertical, Search } from 'lucide-react';
import { Player, Room } from '@/types/Room';
import { Socket } from 'socket.io-client';
import PrivacySection from '@/components/createRoom/PrivacySection';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface RoomPanelProps {
    players?: Player[];
    userName?: string;
    creator: string;
    socket: Socket | null;
    roomId: string;
    roomData?: Room | undefined;
    setRoomData: (newRoom: Room) => void;
}

/**
 * Contenu de l'onglet « Salon » : visibilité de la partie et gestion des
 * joueurs (exclure, nommer chef). Partagé par la colonne latérale du chat
 * (desktop) et la feuille du chat mobile, où il n'existait pas du tout.
 */
const RoomPanel: React.FC<RoomPanelProps> = ({ players, userName, creator, socket, roomId, roomData, setRoomData }) => {
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [playerSearch, setPlayerSearch] = useState("");

    const isCreator = !!userName?.toLowerCase() && userName?.toLowerCase() === creator.toLowerCase();

    // La salle est la seule source de vérité : le panneau peut être monté deux
    // fois (colonne desktop + feuille mobile) sans que les deux divergent.
    const isPrivate = roomData?.isPrivate ?? false;

    const togglePrivacy = (value: boolean) => {
        if (value === isPrivate) return;
        if (roomData) setRoomData({ ...roomData, isPrivate: value });
        socket?.emit('modifyRoomPrivacy', roomId.toUpperCase(), value);
    };

    const handleAdminAction = (username: string, action: string) => {
        socket?.emit('handleActionAdmin', roomId.toUpperCase(), username, action);
        setSelectedPlayer(null);
    };

    const search = playerSearch.toLowerCase();
    const visiblePlayers = (players ?? [])
        .filter((player) => player.username.toLowerCase().includes(search))
        .sort((a, b) => b.score - a.score);

    return (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">

            {isCreator && (
                <div className="p-3 pb-0 shrink-0">
                    <PrivacySection isPrivate={isPrivate} setIsPrivate={togglePrivacy} isConsult={false} />
                </div>
            )}

            <div className="p-3 pb-0 shrink-0">
                <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={playerSearch}
                        onChange={(e) => setPlayerSearch(e.target.value)}
                        placeholder="Rechercher un joueur..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors"
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-2 mask-gradient-top">
                {visiblePlayers.length > 0 ? visiblePlayers.map((player) => (
                    <div key={player.username} className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
                        {player.imageUrl ? (
                            <img src={player.imageUrl} alt={player.username} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                            <div className={`w-8 h-8 shrink-0 rounded-full bg-gradient-to-tr ${player.avatar} flex items-center justify-center text-xs font-bold`}>
                                {player.username.substring(0, 1)}
                            </div>
                        )}
                        <div className="flex-1 min-w-0 flex justify-between items-center gap-2">
                            <span className="flex items-center gap-1.5 min-w-0">
                                {player.username.toLowerCase() === creator && <Crown className="w-3 h-3 text-yellow-400 shrink-0" />}
                                <span className={`text-xs font-medium truncate ${player.username === userName ? 'text-blue-400' : 'text-slate-200'}`}>{player.username}</span>
                            </span>
                            <span className="text-xs font-mono text-slate-400 shrink-0">{player.score} pts</span>
                        </div>
                        {isCreator && (userName?.toLowerCase() !== player.username.toLowerCase()) && (
                            <button
                                type="button"
                                aria-label={`Actions sur ${player.username}`}
                                onClick={() => setSelectedPlayer(player)}
                                className="max-md:tap-target -my-1 flex shrink-0 items-center justify-center rounded-full text-slate-400 hover:text-white active:bg-white/10 transition-colors cursor-pointer"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )) : (
                    <span className="text-xs text-slate-500 italic">
                        {players && players.length > 0 ? `Aucun joueur ne correspond à "${playerSearch}".` : 'Aucun joueur pour le moment.'}
                    </span>
                )}
            </div>

            <AlertDialog open={!!selectedPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
                <AlertDialogContent className="bg-neutral-900 border border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Actions sur {selectedPlayer?.username}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription className="text-slate-400">
                        Que souhaitez-vous faire avec ce joueur ?
                    </AlertDialogDescription>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 hover:bg-white/10 border-white/10 text-white hover:text-white" onClick={() => setSelectedPlayer(null)}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => selectedPlayer && handleAdminAction(selectedPlayer.username, "ban")}
                            className="bg-red-600 hover:bg-red-700 text-white border-0"
                        >
                            Exclure
                        </AlertDialogAction>
                        <AlertDialogAction
                            onClick={() => selectedPlayer && handleAdminAction(selectedPlayer.username, "chef")}
                            className="bg-green-900 hover:bg-green-700 text-white border-0"
                        >
                            Nommer chef
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default RoomPanel;
