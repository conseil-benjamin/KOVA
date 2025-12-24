import React, { useState } from 'react';
import { Send, ChevronDown, MessageSquare } from 'lucide-react';

interface ChatMessage {
    id: number | string;
    type?: string;
    user?: string;
    text?: string;
    message?: string;
}

interface GameInputProps {
    isMobileChatOpen: boolean;
    setIsMobileChatOpen: (val: boolean) => void;
    messages: ChatMessage[];
    onSendGuess: (msg: string) => void;
    onSendChat: (msg: string) => void;
    hasGuessed: boolean;
}

const GameInput: React.FC<GameInputProps> = ({
    isMobileChatOpen, setIsMobileChatOpen, messages, onSendGuess, onSendChat, hasGuessed
}) => {
    // Game Answer State
    const [guessVal, setGuessVal] = useState('');
    // Chat Message State
    const [chatVal, setChatVal] = useState('');

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

    return (
        <div className="flex-none bg-[#0f0f18]/80 backdrop-blur-xl border-t border-white/10 z-40 relative p-2 md:p-4">

            {/* Overlay Chat Mobile (Si ouvert) - Hidden on desktop */}
            {isMobileChatOpen && (
                <div className="md:hidden absolute bottom-full left-0 w-full h-[60vh] bg-black/90 backdrop-blur-xl border-t border-white/10 flex flex-col animate-in slide-in-from-bottom-10 rounded-t-3xl border-x border-white/10 mx-[-1px] shadow-2xl">
                    <div className="flex justify-between items-center p-3 border-b border-white/10 bg-black/40">
                        <span className="text-xs font-bold text-purpe-300 flex items-center gap-2">
                            <MessageSquare className="w-3 h-3" /> Discussion
                        </span>
                        <button onClick={() => setIsMobileChatOpen(false)} className="p-1 rounded-full hover:bg-white/10"><ChevronDown className="w-4 h-4 text-slate-400" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 p-3 text-sm" ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
                        {messages.slice(-20).map((msg, index) => {
                            const text = msg.text || msg.message || '';
                            const user = msg.user || '';
                            const type = msg.type || 'chat';

                            return (
                                <div key={msg.id || index} className="text-xs text-slate-300">
                                    {type === 'chat' && <div className="break-words"><strong className="text-purple-400">{user}:</strong> {text}</div>}
                                    {type === 'success' && <div className="text-green-400 bg-green-500/10 p-1 rounded px-2"><strong className="text-green-300">{user}</strong> a trouvé !</div>}
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
                </div>
            )}

            {/* Toggle Chat Mobile Button (Si fermé) - Hidden on desktop */}
            {!isMobileChatOpen && (
                <div className="md:hidden absolute bottom-full left-4 mb-2">
                    <button onClick={() => setIsMobileChatOpen(true)} className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                        <MessageSquare className="w-3 h-3 text-purple-400" />
                        {messages.length > 0 ? (() => {
                            const lastMsg = messages[messages.length - 1];
                            const lastText = lastMsg.text || lastMsg.message || '...';
                            const lastUser = lastMsg.user || 'Unknown';
                            return <span className="max-w-[150px] truncate">{lastUser}: {lastText}</span>;
                        })() : "Chat"}
                    </button>
                </div>
            )}

            <form onSubmit={handleGuessSubmit} className="max-w-4xl mx-auto relative flex gap-2 md:gap-4 items-center">
                <input
                    type="text"
                    value={guessVal}
                    onChange={(e) => setGuessVal(e.target.value)}
                    placeholder={hasGuessed ? "Attente des autres..." : "Ta réponse..."}
                    disabled={hasGuessed}
                    className={`
                        flex-1 bg-white/5 border-2 transition-all shadow-inner outline-none
                        ${hasGuessed ? 'border-green-500/50 text-green-400 placeholder:text-green-500/50' : 'border-white/10 focus:border-purple-500 text-white placeholder:text-slate-500'}
                        rounded-xl md:rounded-2xl py-3 pl-4 pr-10 md:py-4 md:pl-6 md:pr-12 text-base md:text-lg
                    `}
                />
                <button
                    type="submit"
                    disabled={hasGuessed || !guessVal}
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
