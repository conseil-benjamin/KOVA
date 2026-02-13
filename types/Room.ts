export interface Player {
    id: number;
    username: string;
    score: number;
    hasGuessed: boolean;
    answer: string;
    avatar?: string;
}

export interface Room {
    _id: string;
    idUrl: string;
    name: string;
    pack: string;
    isPrivate: boolean;
    creator: string;
    maxPlayers: number;
    players: Player[];
    scoreToWin: number;
    timePerRound: number;
    enableBlindTest: boolean;
    enableNSFW: boolean;
    itemsEnabled: boolean;
    activeItems: string[];
    createdAt: string;
    timer: number;
    language: string;
}