export interface UserStats {
  xp: number;
  level: number;
  gamesPlayed: number;
  gamesWon: number;
  totalCorrectAnswers: number;
}

export interface UserInventory {
  coins: number;
  consumables: {
    freeze: number;
    hint: number;
    ink: number;
  };
}

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string; // ex: "from-blue-400 to-blue-600"
  title: string;
  stats: UserStats;
  inventory: UserInventory;
  createdAt: string;
  updatedAt: string;
}