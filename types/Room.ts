export interface Player {
    id: number;
    username: string;
    score: number;
    hasGuessed: boolean;
    answer: string;
    responseTime?: number;
    avatar?: string;
    jokers: { name: string; useLeft: number }[];
}

export interface Room {
    _id: string;
    idUrl: string;
    name: string;
    pack: string;
    tags: string[];
    isPrivate: boolean;
    creator: string;
    maxPlayers: number;
    players: Player[];
    oldPlayers: Player[];
    scoreToWin: number;
    timePerRound: number;
    timerEnd: Date;
    status?: string | 'FINISHED' | 'PLAYING' | 'WAITING' | 'TIMER_START';
    enableAbbreviations: boolean;
    enableShowWrongAnswers: boolean;
    enableBlindTest: boolean;
    enableNSFW: boolean;
    itemsEnabled: boolean;
    activeItems: { id: string; maxUses: number }[];
    createdAt: string;
    timer: number;
    language: string;
    backgroundImageUrl: string;
    isGameRunning: boolean;
}