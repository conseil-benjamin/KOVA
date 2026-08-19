export interface Player {
    id: number;
    username: string;
    score: number;
    hasGuessed: boolean;
    answer: string;
    responseTime?: number;
    imageUrl?: string;
    avatar?: string;
    jokers: { name: string; useLeft: number }[];
    activeInk: boolean;
    pointsEarned: number;
}

export interface Room {
    _id: string;
    idUrl: string;
    name: string;
    pack: string;
    packs: string[];
    difficulties?: string[];
    tags: string[];
    isPrivate: boolean;
    creator: string;
    maxPlayers: number;
    players: Player[];
    oldPlayers: Player[];
    banPlayers: string[];
    scoreToWin: number;
    timePerRound: number;
    timerEnd: Date;
    status?: string | 'FINISHED' | 'PLAYING' | 'WAITING' | 'TIMER_START';
    enableAbbreviations: boolean;
    enableShowWrongAnswers: boolean;
    enableBlindTest: boolean;
    enableNSFW: boolean;
    itemsEnabled: boolean;
    activeItems: { [key: string]: number };
    createdAt: string;
    timer: number;
    language: string;
    backgroundImageUrl: string;
    isGameRunning: boolean;
    winner: string;
}
