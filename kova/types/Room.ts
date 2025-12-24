export interface Room {
    _id: string;
    idUrl: string;
    name: string;
    pack: string;
    isPrivate: boolean;
    maxPlayers: number;
    scoreToWin: number;
    timePerRound: number;
    enableBlindTest: boolean;
    enableNSFW: boolean;
    itemsEnabled: boolean;
    activeItems: string[];
    createdAt: string;
}