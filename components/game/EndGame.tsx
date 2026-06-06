import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Home, RotateCcw, Edit, LogOut, Star } from 'lucide-react';
import { Player } from "./Leaderboard";
import Lobby from './Lobby';
import { redirect } from 'next/navigation';

interface EndGameProps {
    players: Player[];
    creator: string;
    username: string;
    setIsEditingRoom: (value: boolean) => void;
    isEditingRoom: boolean;
    handleRestartGame: () => void;
    handleJoinRoom: () => void;
    oldPlayers: Player[];
    handleLeaveGame: () => void;
    xpEarned: number;
}

const MEDAL_COLORS = [
    { bg: 'from-slate-400 to-slate-500', glow: 'shadow-slate-400/40', ring: 'ring-slate-400', label: 'text-slate-300', height: 'h-40', rank: '2' },
    { bg: 'from-yellow-400 to-amber-500', glow: 'shadow-yellow-400/60', ring: 'ring-yellow-400', label: 'text-yellow-300', height: 'h-56', rank: '1' },
    { bg: 'from-amber-600 to-amber-800', glow: 'shadow-amber-700/40', ring: 'ring-amber-600', label: 'text-amber-400', height: 'h-28', rank: '3' },
];

const Particle = ({ index }: { index: number }) => {
    const colors = ['bg-yellow-400', 'bg-indigo-400', 'bg-pink-400', 'bg-cyan-400', 'bg-emerald-400', 'bg-orange-400'];
    const color = colors[index % colors.length];
    const left = `${(index * 7.3) % 100}%`;
    const delay = `${(index * 0.17) % 3}s`;
    const duration = `${2.5 + (index * 0.19) % 2}s`;
    const size = index % 3 === 0 ? 'w-2 h-2' : 'w-1.5 h-1.5';

    return (
        <div
            className={`absolute ${size} ${color} rounded-full opacity-0`}
            style={{
                left,
                top: '-8px',
                animation: `fall ${duration} ${delay} ease-in infinite`,
            }}
        />
    );
};

const EndGame: React.FC<EndGameProps> = ({
                                             players, creator, username, setIsEditingRoom, isEditingRoom,
                                             handleRestartGame, handleJoinRoom, oldPlayers, handleLeaveGame, xpEarned
                                         }) => {
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setRevealed(true), 100);
        return () => clearTimeout(t);
    }, []);

    const podium = [...oldPlayers].sort((a, b) => b.score - a.score).slice(0, 3);
    const orderedPodium = [podium[1] || null, podium[0] || null, podium[2] || null];
    const restPlayers = [...oldPlayers].sort((a, b) => b.score - a.score).slice(3);

    const isInGame = players.some(p => p.username.toLowerCase() === username.toLowerCase());
    const isCreator = creator.toLowerCase() === username.toLowerCase();

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

                .endgame-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #080b14;
                    min-height: 100vh;
                    overflow-x: hidden;
                }

                .endgame-root * { box-sizing: border-box; }

                .display-font { font-family: 'Syne', sans-serif; }

                @keyframes fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }

                @keyframes rise-in {
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @keyframes glow-pulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }

                @keyframes crown-bounce {
                    0%, 100% { transform: translateY(0) rotate(-5deg); }
                    50% { transform: translateY(-6px) rotate(5deg); }
                }

                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                .rise-delay-1 { animation: rise-in 0.6s 0.2s both ease-out; }
                .rise-delay-2 { animation: rise-in 0.6s 0.4s both ease-out; }
                .rise-delay-3 { animation: rise-in 0.6s 0.6s both ease-out; }
                .rise-delay-4 { animation: rise-in 0.6s 0.8s both ease-out; }
                .rise-delay-5 { animation: rise-in 0.6s 1.0s both ease-out; }

                .shimmer-text {
                    background: linear-gradient(90deg, #f59e0b, #fde68a, #f59e0b, #fbbf24, #f59e0b);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 3s linear infinite;
                }

                .podium-block {
                    transition: transform 0.3s ease;
                }
                .podium-block:hover { transform: translateY(-4px); }

                .glass-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    backdrop-filter: blur(8px);
                }

                .action-bar {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 50;
                    background: linear-gradient(to top, rgba(8,11,20,0.98) 60%, transparent 100%);
                    padding: 1rem 1.5rem 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 0.625rem;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    backdrop-filter: blur(12px);
                }

                .btn-primary {
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    border: 1px solid rgba(99,102,241,0.4);
                    color: white;
                    padding: 0.625rem 1.5rem;
                    border-radius: 9999px;
                    font-weight: 600;
                    font-size: 0.875rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    letter-spacing: 0.01em;
                    text-decoration: none;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(99,102,241,0.4);
                }

                .btn-success {
                    background: linear-gradient(135deg, #10b981, #059669);
                    border: 1px solid rgba(16,185,129,0.4);
                    color: white;
                    padding: 0.625rem 1.5rem;
                    border-radius: 9999px;
                    font-weight: 600;
                    font-size: 0.875rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    letter-spacing: 0.01em;
                }
                .btn-success:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(16,185,129,0.4);
                }

                .btn-danger {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    border: 1px solid rgba(239,68,68,0.4);
                    color: white;
                    padding: 0.625rem 1.5rem;
                    border-radius: 9999px;
                    font-weight: 600;
                    font-size: 0.875rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    letter-spacing: 0.01em;
                }
                .btn-danger:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(239,68,68,0.35);
                }

                .btn-ghost {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.12);
                    color: rgba(255,255,255,0.7);
                    padding: 0.625rem 1.5rem;
                    border-radius: 9999px;
                    font-weight: 500;
                    font-size: 0.875rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    letter-spacing: 0.01em;
                }
                .btn-ghost:hover {
                    background: rgba(255,255,255,0.09);
                    color: white;
                    transform: translateY(-1px);
                }

                .score-bar {
                    height: 3px;
                    border-radius: 2px;
                    background: linear-gradient(90deg, #6366f1, #a78bfa);
                }

                .rank-row {
                    transition: background 0.15s ease;
                }
                .rank-row:hover {
                    background: rgba(255,255,255,0.04);
                }

                .avatar-ring-gold { box-shadow: 0 0 0 2px #f59e0b, 0 0 20px rgba(245,158,11,0.4); }
                .avatar-ring-silver { box-shadow: 0 0 0 2px #94a3b8, 0 0 16px rgba(148,163,184,0.3); }
                .avatar-ring-bronze { box-shadow: 0 0 0 2px #b45309, 0 0 14px rgba(180,83,9,0.3); }

                .grid-bg {
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 40px 40px;
                }

                .vignette {
                    background: radial-gradient(ellipse at center, transparent 40%, rgba(8,11,20,0.95) 100%);
                }
            `}</style>

            <div className="endgame-root relative">

                {/* Confetti particles */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    {Array.from({ length: 28 }, (_, i) => <Particle key={i} index={i} />)}
                </div>

                {/* Grid background */}
                <div className="fixed inset-0 grid-bg opacity-60 z-0" />

                {/* Ambient glow */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
                         style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
                    <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full"
                         style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
                </div>

                <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-12 pb-28">

                    {/* Header */}
                    <div className="rise-delay-1 text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-medium text-white/50 uppercase tracking-widest mb-4">
                            <Star size={12} className="text-yellow-400" />
                            Partie terminée
                        </div>
                        <h1 className="display-font text-5xl sm:text-6xl font-extrabold text-white leading-none tracking-tight">
                            CLASSEMENT{' '}
                            <span className="shimmer-text">FINAL</span>
                        </h1>
                    </div>

                    {/* Podium */}
                    <div className="rise-delay-2 w-full max-w-2xl mb-10">
                        <div className="flex items-end justify-center gap-3 sm:gap-5">
                            {orderedPodium.map((player, visualIdx) => {
                                if (!player) return <div key={visualIdx} className="flex-1 max-w-[180px]" />;
                                const medal = MEDAL_COLORS[visualIdx];
                                const isGold = visualIdx === 1;
                                const rankNumber = visualIdx === 0 ? 2 : visualIdx === 1 ? 1 : 3;

                                const initials = player.username.slice(0, 2).toUpperCase();
                                const avatarRing = isGold ? 'avatar-ring-gold' : visualIdx === 0 ? 'avatar-ring-silver' : '';

                                return (
                                    <div key={player.id} className="podium-block flex flex-col items-center flex-1 max-w-[180px]">

                                        {/* Crown / Icon */}
                                        {isGold && (
                                            <div style={{ animation: 'crown-bounce 2s ease-in-out infinite' }} className="text-2xl mb-1">
                                                👑
                                            </div>
                                        )}

                                        {/* Avatar */}
                                        <div
                                            className={`w-14 h-14 rounded-2xl mb-2 flex items-center justify-center text-sm font-bold ${avatarRing}`}
                                            style={{
                                                background: `linear-gradient(135deg, ${isGold ? '#f59e0b, #d97706' : visualIdx === 0 ? '#94a3b8, #64748b' : '#b45309, #92400e'})`,
                                            }}
                                        >
                                            {initials}
                                        </div>

                                        {/* Name + score */}
                                        <p className={`font-semibold text-sm truncate w-full text-center mb-0.5 ${isGold ? 'text-white' : 'text-white/80'}`}>
                                            {player.username}
                                        </p>
                                        <p className={`text-xs font-mono font-bold mb-3 ${isGold ? 'text-yellow-400' : 'text-white/50'}`}>
                                            {player.score.toLocaleString()} pts
                                        </p>

                                        {/* Podium block */}
                                        <div
                                            className={`w-full rounded-t-xl flex flex-col items-center justify-center gap-1 relative overflow-hidden
                                                ${medal.height}
                                            `}
                                            style={{
                                                background: isGold
                                                    ? 'linear-gradient(180deg, rgba(245,158,11,0.25) 0%, rgba(245,158,11,0.1) 100%)'
                                                    : visualIdx === 0
                                                        ? 'linear-gradient(180deg, rgba(148,163,184,0.18) 0%, rgba(148,163,184,0.07) 100%)'
                                                        : 'linear-gradient(180deg, rgba(180,83,9,0.2) 0%, rgba(180,83,9,0.07) 100%)',
                                                borderTop: `2px solid ${isGold ? 'rgba(245,158,11,0.6)' : visualIdx === 0 ? 'rgba(148,163,184,0.4)' : 'rgba(180,83,9,0.5)'}`,
                                                borderLeft: '1px solid rgba(255,255,255,0.06)',
                                                borderRight: '1px solid rgba(255,255,255,0.06)',
                                            }}
                                        >
                                            {isGold && (
                                                <div className="absolute inset-0 opacity-20"
                                                     style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.6), transparent 60%)' }} />
                                            )}
                                            <span
                                                className="display-font font-black text-4xl"
                                                style={{ color: isGold ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.15)' }}
                                            >
                                                {rankNumber}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <p className={'text-gray-200'}>XP Gagnées : {xpEarned}</p>

                    {/* Remaining rankings */}
                    {restPlayers.length > 0 && (
                        <div className="rise-delay-3 w-full max-w-xl mb-8">
                            <div className="glass-card rounded-2xl overflow-hidden">
                                {restPlayers.map((player, idx) => {
                                    const rank = idx + 4;
                                    const maxScore = oldPlayers[0]?.score || 1;
                                    const pct = Math.round((player.score / maxScore) * 100);
                                    return (
                                        <div key={player.id} className="rank-row flex items-center gap-3 px-5 py-3 border-b border-white/5 last:border-0">
                                            <span className="display-font text-white/25 font-bold text-sm w-6 text-center flex-shrink-0">
                                                {rank}
                                            </span>
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white/60 flex-shrink-0"
                                                 style={{ background: 'rgba(255,255,255,0.06)' }}>
                                                {player.username.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm text-white/70 truncate">{player.username}</span>
                                                    <span className="text-xs font-mono text-white/40 ml-2 flex-shrink-0">{player.score.toLocaleString()}</span>
                                                </div>
                                                <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="score-bar h-full" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Lobby / Players still in room */}
                    <div className="rise-delay-4 w-full max-w-xl mb-8">
                        <Lobby players={players} />
                    </div>

                </div>

                {/* Fixed action bar */}
                <div className="action-bar rise-delay-5">
                    <button className="btn-ghost" onClick={() => redirect('/')}>
                        <Home size={16} /> Accueil
                    </button>

                    {isInGame ? (
                        <button onClick={handleLeaveGame} className="btn-danger">
                            <LogOut size={16} /> Quitter
                        </button>
                    ) : (
                        <button onClick={handleJoinRoom} className="btn-primary">
                            <RotateCcw size={16} /> Rejouer
                        </button>
                    )}

                    {isCreator && (
                        <>
                            <button
                                className="btn-ghost"
                                onClick={() => setIsEditingRoom(!isEditingRoom)}
                            >
                                <Edit size={16} /> Modifier règles
                            </button>

                            {players.length > 0 && isInGame && (
                                <button onClick={handleRestartGame} className="btn-success">
                                    <RotateCcw size={16} /> Nouvelle partie
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default EndGame;
