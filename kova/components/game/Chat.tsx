import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Trophy, Send } from 'lucide-react';

interface ChatMessage {
    id: number | string;
    type?: string;
    user?: string;
    text?: string;
    message?: string; // adapt to socket message format if needed
    timestamp?: Date;
}

interface ChatProps {
    messages: ChatMessage[];
    userName?: string;
    onSendMessage: (msg: string) => void;
}

const Chat: React.FC<ChatProps> = ({ messages, userName, onSendMessage }) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!msg.trim()) return;
        onSendMessage(msg);
        setMsg("");
    };

    return (
        <aside className="hidden md:flex w-80 bg-[#0a0a12]/50 border-l border-white/5 flex-col backdrop-blur-sm z-20">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> Chat du Room
                </h2>
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">En ligne: 14</span>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 mask-gradient-top">
                {messages.map((msg, index) => {
                    // Normalize message structure
                    const id = msg.id || index;
                    const type = msg.type || 'chat';
                    const user = msg.user || 'Unknown';
                    const text = msg.text || msg.message || '';

                    return (
                        <div key={id} className="text-sm animate-in slide-in-from-bottom-2">
                            {type === 'system' ? (
                                <div className="flex items-center gap-2 my-2 opacity-60">
                                    <div className="h-px bg-white/20 flex-1"></div>
                                    <span className="text-[10px] font-mono text-center">{text}</span>
                                    <div className="h-px bg-white/20 flex-1"></div>
                                </div>
                            ) : type === 'success' ? (
                                <div className="bg-green-500/10 border border-green-500/20 p-2 rounded-lg text-green-400 text-xs flex gap-2 items-center">
                                    <Trophy className="w-3 h-3" />
                                    <span><strong className="text-green-300">{user}</strong> {text}</span>
                                </div>
                            ) : type === 'warning' ? (
                                <div className="text-orange-400 text-xs italic bg-orange-400/10 p-2 rounded-lg border border-orange-400/20 text-center">
                                    {text}
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <span className={`text-xs font-bold ${user === (userName) ? 'text-blue-400' : 'text-purple-400'}`}>{user}</span>
                                    <span className="text-slate-300 leading-tight">{text}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Desktop Message Input */}
            <div className="p-3 border-t border-white/5 bg-black/20">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        placeholder="Ecrire un message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-colors"
                    />
                    <button type="submit" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors">
                        <Send className="w-3 h-3" />
                    </button>
                </form>
            </div>
        </aside>
    );
};

export default Chat;
