import { Dices, Globe, Music, Play } from 'lucide-react';

export const packs = [
    { id: 'mix', name: 'Le Grand Mix KOVA #1', count: 100, color: 'from-purple-500 to-indigo-600', icon: Dices, desc: 'Un mélange aléatoire de tous les thèmes. Idéal pour commencer !' },
    { id: 'internet', name: 'Culture Internet', count: 450, color: 'from-pink-500 to-rose-500', icon: Globe, desc: 'Mèmes, YouTubers, Buzz...' },
    { id: 'music', name: 'Blind Test 2000s', count: 120, color: 'from-blue-400 to-cyan-500', icon: Music, desc: 'Les hits des années 2000.', isAudio: true },
    { id: 'cinema', name: 'Films & Séries', count: 300, color: 'from-orange-400 to-red-500', icon: Play, desc: 'Films, Séries' },
    { id: 'history', name: 'Histoire', count: 300, color: 'from-orange-400 to-red-500', icon: Play, desc: 'Films, Séries' },
    { id: 'geography', name: 'Géographie', count: 300, color: 'from-orange-400 to-red-500', icon: Play, desc: 'Films, Séries' },
    { id: 'sport', name: 'Sport', count: 300, color: 'from-orange-400 to-red-500', icon: Play, desc: 'Films, Séries' },
    { id: 'food', name: 'Aliments', count: 300, color: 'from-orange-400 to-red-500', icon: Play, desc: 'Films, Séries' },
    { id: 'animals', name: 'Animaux', count: 300, color: 'from-orange-400 to-red-500', icon: Play, desc: 'Films, Séries' },
    { id: 'celebrities', name: 'Célébrités', count: 300, color: 'from-orange-400 to-red-500', icon: Play, desc: 'Films, Séries' },
];
