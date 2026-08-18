import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, MessageSquare, Users } from 'lucide-react';
import { Player } from '@/types/Room';

interface ChatMessage {
    id: number | string;
    type?: string;
    user?: string;
    text?: string;
    message?: string;
    timestamp?: Date;
}

interface GameInputProps {
    isMobileChatOpen: boolean;
    setIsMobileChatOpen: (val: boolean) => void;
    messages: ChatMessage[];
    onSendGuess: (msg: string) => void;
    onSendChat: (msg: string) => void;
    hasGuessed: boolean;
    players: Player[];
    username: string;
    focusInputResponse: boolean;
    setFocusInputResponse: (val: boolean) => void;
    timerVisible: boolean;
    guessVal: string;
    setGuessVal: (val: string) => void;
    pointsEarned: number;
    /** Onglet « Salon » (visibilité de la partie, exclure / nommer chef) : sur
     *  desktop il vit dans la colonne du chat, inaccessible sur mobile. */
    roomPanel?: React.ReactNode;
}

const GameInput: React.FC<GameInputProps> = ({
    isMobileChatOpen, setIsMobileChatOpen, messages, onSendGuess, onSendChat, hasGuessed, players, username, focusInputResponse, setFocusInputResponse, timerVisible, guessVal, setGuessVal, pointsEarned, roomPanel
}) => {
    // Game Answer State
    // Chat Message State
    const [chatVal, setChatVal] = useState('');
    const [mobileTab, setMobileTab] = useState<'chat' | 'players'>('chat');
    const inputRef = useRef<HTMLInputElement>(null);

    const openMobilePanel = (tab: 'chat' | 'players') => {
        setMobileTab(tab);
        setIsMobileChatOpen(true);
    };

    const tabClass = (tab: 'chat' | 'players') =>
        `flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${mobileTab === tab ? 'bg-white/10 text-white' : 'text-slate-400 active:bg-white/5'}`;

    const handleGuessSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!guessVal.trim()) return;
        onSendGuess(guessVal);
        setGuessVal('');
    };

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatVal.trim()) return;
        onSendChat(chatVal);
        setChatVal('');
    };

    useEffect(() => {
        if (focusInputResponse && inputRef.current) {
            inputRef.current.focus();
        }
    }, [focusInputResponse]);

    const isInGame = players.some((player) => player.username.toLowerCase() === username.toLowerCase());
    console.log(focusInputResponse);
    return (
        <div className="flex-none bg-[#0f0f18]/80 backdrop-blur-xl border-t border-white/10 z-40 relative p-2 md:p-4 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] md:pb-4">

            {/* Overlay Chat Mobile (Si ouvert) - Hidden on desktop */}
            {isMobileChatOpen && (
                <div className={`md:hidden absolute bottom-full left-0 w-full ${mobileTab === 'players' ? 'h-[70dvh] kb:h-[46dvh]' : 'h-[55dvh] kb:h-[40dvh]'} max-h-[30rem] bg-black/90 backdrop-blur-xl border-t border-white/10 flex flex-col animate-in slide-in-from-bottom-10 rounded-t-3xl border-x border-white/10 mx-[-1px] shadow-2xl`}>
                    <div className="flex items-center gap-2 p-2 border-b border-white/10 bg-black/40">
                        <button onClick={() => setMobileTab('chat')} className={tabClass('chat')}>
                            <MessageSquare className="w-3 h-3" /> Chat
                        </button>
                        {roomPanel && (
                            <button onClick={() => setMobileTab('players')} className={tabClass('players')}>
                                <Users className="w-3 h-3" /> Salon
                                <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/20">{players.length}</span>
                            </button>
                        )}
                        <button onClick={() => setIsMobileChatOpen(false)} aria-label="Fermer" className="tap-target shrink-0 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20"><ChevronDown className="w-5 h-5 text-slate-400" /></button>
                    </div>

                    {mobileTab === 'players' ? roomPanel : (
                    <>
                    <div className="flex-1 overflow-y-auto overscroll-contain space-y-2 p-3 text-sm" ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
                        {messages.slice(-20).map((msg, index) => {
                            const text = msg.text || msg.message || '';
                            const user = msg.user || '';
                            const type = msg.type || 'chat';
                            const timestamp = msg.timestamp

                            return (
                                <div key={msg.id || index} className="text-xs text-slate-300 mb-4">
                                    {type === 'chat' && (
                                        <div className="break-words flex flex-col">
                                            <div className={"flex items-center gap-2 mb-1"}>
                                                <span className={`text-xs font-bold text-gray-300`}>{timestamp?.toLocaleString().substring(11, 16)}</span>
                                                <span className={`text-xs font-bold ${user === (username) ? 'text-blue-400' : 'text-purple-400'}`}>{user}</span>
                                            </div>
                                            <span className="text-slate-300 leading-tight wrap-anywhere">{text}</span>
                                        </div>
                                    )}
                                    {type === 'success' && (
                                        <div className="text-green-400 bg-green-500/10 p-1 rounded px-2">
                                            <strong className="text-green-300">{user}</strong> a trouvé !
                                        </div>
                                    )}
                                    {type === 'system' && (
                                        <div className="text-slate-400 bg-slate-500/10 p-1 rounded px-2 flex flex-col">
                                            <div className={"flex items-center gap-2 mb-1"}>
                                                <span className={`text-xs font-bold text-gray-300`}>{timestamp?.toLocaleString().substring(11, 16)}</span>
                                            </div>
                                            <div className="h-px bg-white/20 flex-1"></div>
                                            <span className="text-[10px] font-mono text-center">{text}</span>
                                            <div className="h-px bg-white/20 flex-1"></div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Mobile Chat Input */}
                    <div className="p-2 border-t border-white/10 bg-black/60">
                        <form onSubmit={handleChatSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={chatVal}
                                onChange={(e) => setChatVal(e.target.value)}
                                placeholder="Dis quelque chose..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors"
                            />
                            <button type="submit" className="bg-purple-600/20 border border-purple-500/30 p-2 rounded-full text-purple-200">
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                    </>
                    )}
                </div>
            )}

            {/* Toggle Chat Mobile Button (Si fermé) - Hidden on desktop */}
            {!isMobileChatOpen && (
                <div className="md:hidden kb:hidden absolute bottom-full left-3 right-3 mb-2 flex items-center justify-between gap-2">
                    <button onClick={() => openMobilePanel('chat')} className="min-w-0 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-lg active:scale-95 transition">
                        <MessageSquare className="w-3 h-3 text-purple-400 shrink-0" />
                        {messages.length > 0 ? (() => {
                            const lastMsg = messages[messages.length - 1];
                            const lastText = lastMsg.text || lastMsg.message || '...';
                            const lastUser = lastMsg.user || 'Unknown';
                            return <span className="max-w-[150px] truncate">{lastUser}: {lastText}</span>;
                        })() : "Chat"}
                    </button>

                    {roomPanel && (
                        <button onClick={() => openMobilePanel('players')} className="shrink-0 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-2 rounded-full border border-white/10 flex items-center gap-1.5 shadow-lg active:scale-95 transition">
                            <Users className="w-3 h-3 text-green-400 shrink-0" />
                            Salon
                            <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/20 font-mono">{players.length}</span>
                        </button>
                    )}
                </div>
            )}

            <form onSubmit={handleGuessSubmit} className="max-w-4xl mx-auto relative flex gap-2 md:gap-4 items-center">
                <input
                    ref={inputRef}
                    type="text"
                    value={guessVal}
                    onPaste={(e) => e.preventDefault()}
                    onFocus={() => setFocusInputResponse(false)}
                    onChange={(e) => setGuessVal(e.target.value)}
                    placeholder={hasGuessed ? `${pointsEarned} points gagnés !` : !isInGame ? "Rejoindre pour jouer" : "Ta réponse..."}
                    disabled={hasGuessed || !isInGame || !timerVisible}
                    className={`
                        flex-1 min-w-0 bg-white/5 border-2 transition-all shadow-inner outline-none
                        ${hasGuessed ? 'border-green-500/50 text-green-400 placeholder:text-green-500/50' : 'border-white/10 focus:border-purple-500 text-white placeholder:text-slate-500'}
                        rounded-xl md:rounded-2xl py-3 pl-4 pr-10 md:py-4 md:pl-6 md:pr-12 text-base md:text-lg text-center
                    `}
                />
                <button
                    type="submit"
                    disabled={hasGuessed || !guessVal || !isInGame || !timerVisible}
                    className={`
                        flex-shrink-0 transition-all shadow-lg flex items-center justify-center
                        ${hasGuessed ? 'bg-slate-800 opacity-50' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 active:scale-95 text-white'}
                        p-3 md:p-4 rounded-xl md:rounded-2xl
                    `}
                >
                    <Send className="w-5 h-5 md:w-6 md:h-6" />
                </button>
            </form>
        </div>
    );
};

export default GameInput;

