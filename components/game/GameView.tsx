"use client";

import React, { useState, useEffect, use } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import Cookies from "universal-cookie";

import GameHeader from './GameHeader';
import Chat from './Chat';
import GameArea from './GameArea';
import GameInput from './GameInput';
import Leaderboard, { Player } from './Leaderboard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog';
import { Room } from '@/types/Room';

interface GameViewProps {
    roomId: string;
}

const GameView: React.FC<GameViewProps> = ({ roomId }) => {
    // --- SOCKET LOGIC ---
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]); // Adjust type as needed
    const cookies = new Cookies();
    const [userName, setUserName] = useState(cookies.get('userName') || '');
    const [guestNameInput, setGuestNameInput] = useState('');

    const [roomData, setRoomData] = useState<Room>();

    // --- UI STATE ---
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

    // --- GAME STATE MOCK ---
    const [timeLeft, setTimeLeft] = useState(0);
    const [hasGuessed, setHasGuessed] = useState(false);
    const [players, setPlayers] = useState<Player[]>([]);
    const [creator, setCreator] = useState('');

    // --- GAME STATE ---
    const [question, setQuestion] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [startTimer, setStartTimer] = useState(false);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [points, setPoints] = useState(0);
    const [response, setResponse] = useState('');

    const handleGuestLogin = () => {
        if (guestNameInput.trim()) {
            cookies.set('userName', guestNameInput.trim(), { path: '/' });
            setUserName(guestNameInput.trim());
        }
    };

    const getRoomData = async () => {
        try {
            const res = await fetch(`http://localhost:3333/room/${roomId}`);
            const data = await res.json();
            setRoomData(data);
            setCreator(data.creator);

            const endTime = new Date(data.timerEnd).getTime();
            const secondsRemaining = Math.floor((endTime - Date.now()));
            console.log(secondsRemaining)
            console.log(endTime)
            console.log(Date.now())

            setTimeLeft(Math.max(0, secondsRemaining));
        } catch (error) {
            console.error('Error fetching room data:', error);
        }
    };

    const handleStartGame = () => {
        if (creator === userName) {
            // mettre un timer de 5 secondes avec un chargement avant de lancer réellement
            socket?.emit('start_game', roomId, roomData?.pack, roomData?.timePerRound);
        }
    };

    // --- SOCKET CONNECTION ---
    useEffect(() => {
        const newSocket = io('http://localhost:3333', { autoConnect: false });
        setSocket(newSocket);

        newSocket.on('connection', () => {
            setIsConnected(true);
            toast.success('Connected to server');
        });

        newSocket.on('chat:new', (data: { message: string, timestamp: Date, user: string, type: string }) => {
            setMessages(prev => [...prev, {
                id: Date.now() + Math.random(),
                message: data.message,
                timestamp: data.timestamp,
                user: data.user,
                type: data.type
            }]);
        });

        newSocket.on('new_question', (data: { question: string, imageUrl: string, timerEnd: Date, isGameRunning: boolean }) => {
            console.log(data);
            setQuestion(data.question['fr']);
            setImageUrl(data.imageUrl);
            setResponse('');

            const endTime = new Date(data.timerEnd).getTime() / 1000;
            const secondsRemaining = Math.floor(endTime - Date.now() / 1000);

            setTimeLeft(Math.max(0, secondsRemaining));
            setStartTimer(true);
            setIsGameRunning(data.isGameRunning);
        });

        newSocket.on('wrong_response', (data: { message: string, timestamp: Date, user: string, type: string }) => {
            toast.error('Wrong response');
        });

        newSocket.on('correct_response', (data: { message: string, username: string, points: number }) => {
            toast.success(data.message + data.points);
            setPlayers(prev => [...prev, {
                id: Date.now(),
                name: data.username,
                score: data.points,
                rank: prev.length + 1,
                avatar: 'from-purple-500 to-indigo-500',
                streak: 0,
                status: 'guessed'
            }]);
        });

        newSocket.on('display_response', (data: { response: string }) => {
            setResponse(data.response);
        });

        newSocket.connect();

        getRoomData();

        return () => {
            newSocket.disconnect();
            newSocket.off('room_joined');
            newSocket.off('connect');
            newSocket.off('chat:new');
        };
    }, [roomId]);

    // --- JOIN ROOM LOGIC ---
    useEffect(() => {
        if (socket && isConnected && userName) {
            console.log("Tentative de rejoindre la room:", roomId, "avec", userName);
            const avatar = cookies.get('userAvatar') || 'red';
            socket.emit('join_room', roomId, { username: userName, avatar });
        }
    }, [socket, isConnected, userName, roomId]);

    // --- LOGIQUE TIMER ---
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1 && startTimer) {
                    clearInterval(timer);

                    setStartTimer(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, roomId, roomData, socket]);

    // --- HANDLERS ---
    const handleGameGuess = async (text: string) => {
        // Mock Game Logic check
        const guess = text.toUpperCase().trim();

        socket?.emit('verify_response', roomId, guess, userName);
    };

    const handleChatMessage = (text: string) => {
        console.log("Sending message:", userName);
        if (socket && isConnected) {
            socket.emit('message', { roomId, message: text, user: userName });
        } else {
            toast.error('Non connecté au serveur.')
        }
    };

    return (
        <>
            {!userName ? (
                <div className="bg-neutral-900 min-h-screen h-[100dvh] md:h-screen flex flex-col md:flex-row md:items-center md:justify-center relative overflow-hidden text-white font-sans">
                    <AlertDialog open={true}>
                        <AlertDialogContent className="bg-neutral-900 border border-white/10 text-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Choisir un pseudo</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogDescription className="text-slate-400">
                                Veuillez choisir un pseudo pour vous identifier. Vous jouerez en mode invité.
                            </AlertDialogDescription>

                            <div className="py-4">
                                <input
                                    type="text"
                                    value={guestNameInput}
                                    onChange={(e) => setGuestNameInput(e.target.value)}
                                    placeholder="Votre pseudo..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    onKeyDown={(e) => e.key === 'Enter' && handleGuestLogin()}
                                />
                            </div>

                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-white/5 hover:bg-white/10 border-white/10 text-white hover:text-white">Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleGuestLogin}
                                    disabled={!guestNameInput.trim()}
                                    className="bg-purple-600 hover:bg-purple-700 text-white border-0"
                                >
                                    Continuer
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ) : (
                <div className="bg-neutral-900 min-h-screen h-[100dvh] md:h-screen flex flex-col md:flex-row md:items-center md:justify-center relative overflow-hidden text-white font-sans">

                    {/* CONTAINER DE L'APPLICATION */}
                    <div className="w-full h-full md:w-full md:h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1b26] via-[#0f0f18] to-black">

                        <GameHeader timeLeft={timeLeft} currentUser={userName} creator={roomData?.creator} handleStartGame={handleStartGame} isGameRunning={isGameRunning} />

                        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                            <Leaderboard players={players} />

                            {response ? <div className="flex-1 flex flex-col relative z-10 mask-gradient-top h-[calc(100vh-100px)]">
                                <p className="text-2xl font-bold text-white text-center h-full flex items-center justify-center">{response}</p>
                            </div> :
                                <GameArea
                                    hasGuessed={hasGuessed}
                                    timeLeft={timeLeft}
                                    question={question}
                                    imageUrl={imageUrl}
                                />
                            }
                            <Chat
                                players={players}
                                messages={messages}
                                userName={userName}
                                onSendMessage={handleChatMessage}
                            />
                        </div>

                        <GameInput
                            isMobileChatOpen={isMobileChatOpen}
                            setIsMobileChatOpen={setIsMobileChatOpen}
                            messages={messages}
                            onSendGuess={handleGameGuess}
                            onSendChat={handleChatMessage}
                            hasGuessed={hasGuessed}
                        />

                    </div>
                </div>
            )}
        </>
    );
};

export default GameView;
