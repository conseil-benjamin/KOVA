"use client";

import { useState, useEffect, use } from "react";
import { io } from 'socket.io-client';
import { toast } from "sonner";
import Chatbox from "@/components/inGame/chatbox";
import BannerInGame from "@/components/inGame/banner-in-game";
import Leaderboard from "@/components/inGame/leaderboard";
import ResponseBar from "@/components/inGame/responseBar";
import DisplayQuestions from "@/components/inGame/displayQuestions";
import Cookies from "universal-cookie";

export default function Game({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params);
    const [socket] = useState(() => io('http://localhost:3333', { autoConnect: false }));
    const [message, setMessage] = useState('');
    const MessageObject = { message, timestamp: new Date(), user: 'user' };
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<typeof MessageObject[]>([]);
    const [socketId, setSocketId] = useState('');
    const cookies = new Cookies();
    const userName = cookies.get('userName');

    const sendMessage = () => {
        if (isConnected) {
            socket.emit('message', { roomId, message, user: userName });
        } else {
            toast.error('Not connected to server');
        }
        setMessage('');
    }

    useEffect(() => {
        //listen to ping sent by socket.io
        socket.on('ping', (data: { message: string }) => {
            setIsConnected(true);
            toast.success('Connected to server');
        })

        //listen to message sent by socket.io
        socket.on('chat:new', (data: { message: string, timestamp: Date, user: string }) => {
            console.log("chat:new", data)
            console.log("messages", messages)
            console.log("message", data.message)
            setMessages(prev => [...prev, { message: data.message, timestamp: data.timestamp, user: data.user }])
        })

        socket.on('connect', () => {
            console.log("Connecté, tentative de rejoindre la room:", roomId);
            console.log("Socket ID:", socket.id);
            setSocketId(socket.id || '');
            socket.emit('join_room', roomId);
        });

        socket.connect();

        // Clean up the WebSocket connection on component unmount
        return () => {
            socket.disconnect();
            socket.off('ping');
            socket.off('chat:new');
        };
    }, [roomId]);

    return (
        <div className="flex flex-col h-screen w-full">
            <BannerInGame />
            <div className="flex flex-row h-full">
                <Leaderboard />
                <DisplayQuestions />
                <Chatbox messages={messages} sendMessage={sendMessage} message={message} setMessage={setMessage} currentUser={userName} />
            </div>
            <ResponseBar />
        </div>
    )
}