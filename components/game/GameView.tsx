"use client";

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import Cookies from "universal-cookie";

import GameHeader from './GameHeader';
import Chat from './Chat';
import GameArea from './GameArea';
import GameInput from './GameInput';
import RoomNotFound from './RoomNotFound';
import Leaderboard from './Leaderboard';
import { Player } from '@/types/Room';
import { Room } from '@/types/Room';
import EndGame from './EndGame';
import CreateRoomView from '../createRoom/CreateRoomView';
import { redirect } from 'next/navigation';
import Lobby from './Lobby';
import LoadingPage from '../loadingPage';
import UserService from "@/services/userService";
import RoomService from "@/services/roomService";
import {User} from "@/types/User";
import DisplayResponse from "@/components/game/DisplayResponse";
import Jokers from "@/components/game/Jokers";
import ModalAskForPseudo from "@/components/ModalAskForPseudo";
import {Ghost, ArrowRightLeft} from "lucide-react";
import PlayerIsBan from "@/components/game/PlayerIsBan";
import GameActions from "@/components/game/GameActions";
import RoomPanel from "@/components/game/RoomPanel";
import {getWsUrl} from "@/utils/utils";

interface GameViewProps {
    roomId: string;
}

const GameView: React.FC<GameViewProps> = ({ roomId }) => {
    const userService = new UserService();
    const roomService = new RoomService();
    // --- SOCKET LOGIC ---
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]); // Adjust type as needed
    const cookies = new Cookies();
    const [userName, setUserName] = useState(cookies.get('userName') || '');
    const [userObject, setUserObject] = useState<User>(cookies.get('user') ? cookies.get('user') : null);
    const [guestNameInput, setGuestNameInput] = useState('');
    const [roomFound, setRoomFound] = useState(true);
    const [isGameEnded, setIsGameEnded] = useState(false);
    const [isGameNotStarted, setIsGameNotStarted] = useState(false);
    const [guessVal, setGuessVal] = useState('');

    const [roomData, setRoomData] = useState<Room>();

    // --- UI STATE ---
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditingRoom, setIsEditingRoom] = useState(false);
    const [isConsultRules, setIsConsultRules] = useState(false);

    const [timeLeft, setTimeLeft] = useState(0);
    const [endsAt, setEndsAt] = useState<number | null>(null);
    const [timerVisible, setTimerVisible] = useState(false);
    const [hasGuessed, setHasGuessed] = useState(false);
    const [focusInputResponse, setFocusInputResponse] = useState(false);
    const [players, setPlayers] = useState<Player[]>([]);
    const [oldPlayers, setOldPlayers] = useState<Player[]>([]);
    const [creator, setCreator] = useState('');
    const [isPlayerBan, setIsPlayerBan] = useState(false);
    const [activesItems, setActivesItems] = useState<{ [key: string]: number }>();
    const [itemsEnabled, setItemsEnabled] = useState(false);
    const [jokersLeft, setJokersLeft] = useState<{ name: string; useLeft: number }[]>([]);

    // --- GAME STATE ---
    const [question, setQuestion] = useState('');
    const [questionTheme, setQuestionTheme] = useState('');
    const [questionStory, setQuestionStory] = useState('');
    const [hint, setHint] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [startTimer, setStartTimer] = useState(false);
    const [gameStartingSoonTimer, setGameStartingSoonTimer] = useState(-1);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [points, setPoints] = useState(0);
    const [response, setResponse] = useState('');
    const [firstResponsePlayer, setFirstResponsePlayer] = useState('');
    const [scoreToWin, setScoreToWin] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [activeInk, setActiveInk] = useState(false);
    const [winner, setWinner] = useState('');

    const handleGuestLogin = async () => {
        try {
            // null = pseudo libre ; un utilisateur = pseudo déjà pris.
            const result = await userService.getUserDataByUsername(guestNameInput.trim());
            if (!result) {
                cookies.set('userName', guestNameInput.trim().toLowerCase(), { path: '/' });
                setUserName(guestNameInput.trim());
                console.log("User logged in as:", guestNameInput.trim());
            } else {
                toast.error('Username already exists');
                setUserName("");
            }
        } catch (error) {
            // Une panne réseau ne doit pas laisser l'écran de pseudo sans réponse.
            console.error("Erreur connexion API:", error);
            toast.error('Impossible de vérifier ce pseudo');
        }
    };

    const getRoomData = async () => {
        try {
            const res = await roomService.getRoom(roomId);
            const data = JSON.parse(res.data);
            console.log(res.status)
            if (data === null || data === undefined || res.status === 404) {
                setRoomFound(false);
                return;
            } else {
                setRoomFound(true);
                setRoomData(data);
                setCreator(data.creator);
                setIsGameRunning(data.isGameRunning);
                setPlayers(data.players);
                setScoreToWin(data.scoreToWin);
                setOldPlayers(data.oldPlayers);
                setActivesItems(data.activeItems);
                setWinner(data.winner);
                setItemsEnabled(data.itemsEnabled);

                const endTime = new Date(data.timerEnd).getTime() / 1000;
                setEndsAt(endTime);
                const secondsRemaining = Math.floor((endTime - Date.now() / 1000));
                console.log("getRoomData", data);

                // vérification si le joueur est banni de la partie
                if (data.banPlayers?.some((u: string) => u.toLowerCase() === userName.toLowerCase())) {
                    setIsPlayerBan(true)
                }

                switch (data.status) {
                    case "FINISHED":
                        setIsGameEnded(true);
                        break;
                    case "TIMER_START":
                        gameStartingSoon(data.timerEnd);
                        break;
                    case "LOBBY":
                        setIsGameNotStarted(true);
                        break;
                    case "DISPLAY_RESPONSE":
                        setResponse(data.answers[data.language][0]);
                        break;
                    default:
                        break;
                }

                // Les jokers affichés sont ceux du joueur courant. La boucle
                // appelait setJokersLeft pour CHAQUE joueur : c'est le dernier
                // de la liste qui gagnait, d'où un panneau vide dès qu'un autre
                // joueur fermait la marche (ou n'avait aucun joker).
                const localPlayer = data.players?.find(
                    (p: Player) => p.username.toLowerCase() === userName.toLowerCase()
                );
                if (localPlayer) {
                    setJokersLeft(localPlayer.jokers ?? []);
                    if (localPlayer.hasGuessed) setHasGuessed(true);
                    if (localPlayer.activeInk === true) setActiveInk(true);
                }
                setTimeLeft(Math.max(0, secondsRemaining));
                setTimerVisible(true);
                setQuestionStory(data?.questionStory?.[data.language]);
                setImageUrl(data?.imageUrl);
                setQuestionTheme(data?.question?.theme);
                setQuestionTheme(data?.question?.difficulty);
            }
        } catch (error) {
            console.error('Error fetching room data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartGame = () => {
        if (creator.toLowerCase() === userName.toLowerCase() && players.length > 0) {
            socket?.emit('start_game', roomId, roomData?.packs, roomData?.timePerRound);
        } else if (creator.toLowerCase() === userName.toLowerCase() && players.length <= 0) {
            toast.error('Il faut au moins 2 joueurs pour lancer une partie.');
        }
    };

    async function gameStartingSoon(timerEnd: Date) {
        const endTime = new Date(timerEnd).getTime() / 1000;
        const secondsRemaining = Math.min(endTime - Date.now() / 1000);

        // @ts-ignore
        setGameStartingSoonTimer(secondsRemaining.toFixed(0));

        const timer = setInterval(() => {
            setGameStartingSoonTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return -1;
                }
                return prev - 1;
            });
        }, 1000);
    }

    // --- SOCKET CONNECTION ---
    useEffect(() => {
        const newSocket = io(getWsUrl(), { autoConnect: false });
        setSocket(newSocket);

        newSocket.on('connection', () => {
            setIsConnected(true);
            toast.success('Connected to server');
            setIsLoading(false)
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

        newSocket.on('cancel_start', () => {
            setGameStartingSoonTimer(-1);
            toast.error('Game cancelled');
        });

        newSocket.on('new_question', (data: { question: string, imageUrl: string, theme: string, difficulty: string, story: string, timerEnd: Date, isGameRunning: boolean, language: string }) => {
            console.log(data);
            setHint('');
            setQuestionTheme(data.difficulty);
            setPlayers(prev => prev.map(p => ({ ...p, responseTime: undefined })));
            if (data.language === "fr") {
                setQuestion(data.question[0]);
                setQuestionStory(data.story[0]);
            } else {
                setQuestion(data.question[1]);
                setQuestionStory(data.story[1]);
            }
            setImageUrl(data.imageUrl);
            setResponse('');

            const endTime = new Date(data.timerEnd).getTime() / 1000;
            setEndsAt(endTime);
            const secondsRemaining = Math.floor(endTime - Date.now() / 1000);

            // todo : besoin de trouver un meilleur fix que de faire + 1
            setTimeLeft(Math.max(0, (secondsRemaining)));
            setTimerVisible(true);
            setStartTimer(true);
            setIsGameRunning(data.isGameRunning);
            setFocusInputResponse(true);
        });

        newSocket.on('wrong_response', (data: { message: string, username: string, answer: string }) => {
            setPlayers(prev => {
                const playerIndex = prev.findIndex(p => p.username.toLowerCase() === data.username.toLowerCase());
                if (playerIndex !== -1) {
                    const newPlayers = [...prev];
                    newPlayers[playerIndex] = {
                        ...newPlayers[playerIndex],
                        answer: data.answer,
                    };
                    return newPlayers;
                }
                return [...prev];
            });
        });

        newSocket.on('game_starting_soon', (data: { timerEnd: Date }) => {
            console.log("game_starting_soon", data);
            setResponse('');
            gameStartingSoon(data.timerEnd);
            setIsGameEnded(false);
            setIsGameNotStarted(false);
        });

        newSocket.on('correct_response', (data: { message: string, username: string, points: number, responseTime: number }) => {
            // @ts-ignore
            setPlayers(prev => {
                const playerIndex = prev.findIndex(p => p.username.toLowerCase() === data.username.toLowerCase());
                if (playerIndex !== -1) {
                    const newPlayers = [...prev];
                    newPlayers[playerIndex] = {
                        ...newPlayers[playerIndex],
                        score: data.points,
                        hasGuessed: true,
                        responseTime: data.responseTime
                    };
                    return newPlayers;
                }
                return [...prev, {
                    id: Date.now(),
                    username: data.username,
                    score: data.points,
                    hasGuessed: true,
                    answer: "",
                    responseTime: data.responseTime
                }];
            });
            if (data.username.toLowerCase() === userName.toLowerCase()) {
                setHasGuessed(true);
            }
        });

        newSocket.on('display_response', (data: { response: string, firstResponsePlayer: string }) => {
            setPlayers(prev => prev.map(p => ({ ...p, hasGuessed: false })));
            setResponse(data.response);
            setFirstResponsePlayer(data.firstResponsePlayer || '');
            setHasGuessed(false);
            resetAnswersPlayers();
            setTimerVisible(false);
            setTimeLeft(0);
            setGuessVal('');
        });

        newSocket.on('hint_used', (data: { hint: string, username: string }) => {
            console.log("hint_used", data.hint);
            setHint(data.hint)
        });

        newSocket.on('update_room', (room: Room) => {
            setRoomData(room);
            setActivesItems(room.activeItems);
            setScoreToWin(room.scoreToWin);
            // Sans ça, itemsEnabled restait figé sur la valeur lue au premier
            // chargement : jokers désactivés pour toute la partie si cet appel
            // avait échoué. Test de type pour ne pas repasser à false quand le
            // serveur omet le champ.
            if (typeof room.itemsEnabled === 'boolean') setItemsEnabled(room.itemsEnabled);

            const localPlayer = room.players.find(p => p.username.toLowerCase() === userName.toLowerCase());
            if (room.banPlayers?.some(u => u.toLowerCase() === userName.toLowerCase())) {
                setIsPlayerBan(true)
            }
            setCreator(room.creator)
            if (localPlayer) {
                setJokersLeft(localPlayer.jokers);
                setActiveInk(localPlayer.activeInk);
            }

            // @ts-ignore
            setPlayers(prev => {
                return room.players.map(roomPlayer => {
                    const existingPlayer = prev.find(p => p.username.toLowerCase() === roomPlayer.username.toLowerCase());

                    if (existingPlayer) {
                        return {
                            ...existingPlayer,
                            score: roomPlayer.score,
                            hasGuessed: roomPlayer.hasGuessed,
                            avatar: roomPlayer.avatar || existingPlayer.avatar,
                            jokers: roomPlayer.jokers,
                            imageUrl: roomPlayer.imageUrl || existingPlayer.imageUrl,
                            inkActive: roomPlayer.activeInk || existingPlayer.activeInk
                        };
                    } else {
                        return {
                            id: Date.now(),
                            username: roomPlayer.username,
                            score: roomPlayer.score,
                            hasGuessed: roomPlayer.hasGuessed,
                            answer: "",
                            avatar: roomPlayer.avatar,
                            jokers: roomPlayer.jokers,
                            imageUrl: roomPlayer.imageUrl,
                            inkActive: roomPlayer.activeInk
                        };
                    }
                });
            });
        });

        newSocket.on("joker_type_already_use", (data: { message: string }) => {
            toast.error(data.message);
        });

        newSocket.on("joker_use", (data: { message: string, jokerType: string }) => {
            // Le joker "hint" n'est pas assez intéressant pour être annoncé
            switch (data.jokerType) {
                case "ink":
                    toast(data.message, {
                        position: "bottom-left",
                        icon: <Ghost className="w-4 h-4 text-blue-400" />,
                        className: "!bg-blue-500/10 !border !border-blue-500/20 !text-blue-200",
                    });
                    break;
                case "double":
                    toast(data.message, {
                        position: "bottom-left",
                        icon: <span className="font-black text-xs text-green-400">x2</span>,
                        className: "!bg-green-500/10 !border !border-green-500/20 !text-green-200",
                    });
                    break;
                case "swap":
                    toast(data.message, {
                        position: "bottom-left",
                        icon: <ArrowRightLeft className="w-4 h-4 text-amber-400" />,
                        className: "!bg-amber-500/10 !border !border-amber-500/20 !text-amber-200",
                    });
                    break;
            }
        });

        newSocket.on('display_toast_message', (data: {message: string}) => {
            toast(data.message, {
                position: "top-right",
                icon: <ArrowRightLeft className="w-4 h-4 text-amber-400" />,
                className: "!bg-amber-500/10 !border !border-amber-500/20 !text-amber-200",
            });
        });

        newSocket.on('game_finished', (data: { message: string, players: Player[], roomData: Room }) => {
            console.log("game_finished", data);
            const winnerUsername = data.roomData.winner;
            console.log("winnerUsername", winnerUsername);
            setQuestion('');

            data.players.forEach(player => {
                if (player.username.toLowerCase() === userName.toLowerCase()) {
                    if (winnerUsername === userName.toLowerCase()) {
                        setXpEarned(player.score * 1.5)
                    } else {
                        setXpEarned(player.score)
                    }
                }
            });

            console.log("oldPlayers", data.players);
            setPlayers([]);
            setIsGameRunning(false);
            setOldPlayers(data.players);
            setRoomData(data.roomData);
        });

        newSocket.emit('join_room', roomId.toUpperCase());

        newSocket.connect();

        getRoomData();

        console.log("roomData", roomData);
        console.log("isGameEnded", isGameEnded);
        console.log("isEditingRoom", isEditingRoom);
        console.log("oldPlayers", oldPlayers);
        console.log("oldPlayers.length", oldPlayers?.length);

        return () => {
            newSocket.disconnect();
            newSocket.off('room_joined');
            newSocket.off('connect');
            newSocket.off('chat:new');
            newSocket.off('new_question');
            newSocket.off('wrong_response');
            newSocket.off('correct_response');
            newSocket.off('update_room');
            newSocket.off('end_game');
            newSocket.off('game_starting_soon');
            newSocket.off('display_response');
        };
    }, [roomId]);

    useEffect(() => {
        if (oldPlayers && oldPlayers.length > 0 && !isGameEnded && !isGameRunning && players.length === 0) {
            setIsGameEnded(true);
        }
        console.log("oldPlayers", oldPlayers);
        console.log("isGameEnded", isGameEnded);
        console.log("isGameRunning", isGameRunning);
        console.log("players.length", players.length);

    }, [oldPlayers, players]);

    // --- AUTO JOIN LOGIC ---
    useEffect(() => {
        if (socket && isConnected && userName) {
            const isPlayer = players.some(p => p.username.toLowerCase() === userName.toLowerCase());

            if (isPlayer) {
                console.log("Auto-joining room for", userName);
                const avatar = cookies.get('userAvatar') || 'red';
                socket.emit('join_room', roomId.toUpperCase(), { username: userName, avatar });
            }
        }
    }, [socket, isConnected, userName, roomId]);

    // --- HANDLERS ---

    const handleCancelStartGame = () => {
        if (socket && isConnected && (creator.toLowerCase() === userName.toLowerCase())) {
            socket?.emit('cancel_start', roomId);
            setIsGameRunning(false)
        }
    }

    const handleJoinRoom = () => {
        if (socket && isConnected && userName && roomFound) {
            console.log("Tentative de rejoindre la room:", roomId, "avec", userName);
            const user: User = cookies.get('user')
            const imageUrl = user?.imageUrl || '';
            const avatar = cookies.get('userAvatar') || 'red';
            socket.emit('join_room', roomId.toUpperCase(), { username: userName, avatar, imageUrl });
        }
    }

    const handleRestartGame = () => {
        console.log("handleRestartGame");
        if (socket && isConnected && (creator.toLowerCase() === userName.toLowerCase())) {
            console.log(userName);
            socket?.emit('start_game', roomId, roomData?.packs, roomData?.timePerRound);
            setIsGameEnded(false);
        }
    }

    const handleLeaveGame = () => {
        console.log("handleLeaveGame");
        if (socket && isConnected) {
            socket.emit('leave_room', roomId.toUpperCase(), userName);
            redirect("/")
        }
    }

    const handleGameGuess = async (text: string) => {
        const guess = text.toUpperCase().trim();
        socket?.emit('verify_response', roomId.toUpperCase(), guess, userName, roomData?.language);
    };

    const handleChatMessage = (text: string) => {
        console.log("Sending message:", userName);
        if (socket && isConnected) {
            socket.emit('message', { roomId, message: text, user: userName });
        } else {
            toast.error('Non connecté au serveur.')
        }
    };

    const handleUseJoker = (item: string) => {
        if (socket && isConnected) {
            console.log("Sending joker use:", userName + " " + item);
            socket.emit('use_joker', roomId.toUpperCase(), item, userName);
        }
    }

    const resetAnswersPlayers = () => {
        setPlayers(prev => {
            const newPlayers = [...prev];
            newPlayers.forEach(player => {
                player.answer = '';
            });
            return newPlayers;
        });
    };

    return (
        <>
            {!userName && !isLoading ? (
                <div
                    className="app-shell bg-neutral-900 h-[var(--app-h)] md:h-screen flex flex-col md:flex-row md:items-center md:justify-center relative overflow-hidden text-white font-sans">
                    <ModalAskForPseudo guestNameInput={guestNameInput} setGuestNameInput={setGuestNameInput} handleGuestLogin={handleGuestLogin}/>
                </div>
            ) : !roomFound ? (
                <RoomNotFound/>
            ) : isConsultRules ? (
                <CreateRoomView
                    setIsConsult={setIsConsultRules}
                    isConsult={true}
                    socket={null}
                    setRoomData={setRoomData}
                    isEditing={false}
                    dataRoom={roomData}
                    setIsEditing={setIsEditingRoom}
                    creator={creator}
                />
            ) : isEditingRoom ? (
                <CreateRoomView
                    setIsConsult={setIsConsultRules}
                    isConsult={false}
                    socket={socket}
                    setRoomData={setRoomData}
                    isEditing={true}
                    dataRoom={roomData}
                    setIsEditing={setIsEditingRoom}
                    creator={creator}
                />
            ) : isLoading ? (
                <div
                    className="app-shell bg-neutral-900 h-[var(--app-h)] md:h-screen flex flex-col md:flex-row md:items-center md:justify-center relative overflow-hidden text-white font-sans">
                    <div className="flex items-center justify-center h-full w-full">
                        <LoadingPage/>
                    </div>
                </div>
            ) : isPlayerBan ? (
                <div
                    className="app-shell bg-neutral-900 h-[var(--app-h)] md:h-screen flex flex-col md:flex-row md:items-center md:justify-center relative overflow-hidden text-white font-sans">
                    <div className="flex items-center justify-center h-full w-full">
                        <PlayerIsBan/>
                    </div>
                </div>
            ) : (isGameNotStarted && !isEditingRoom && oldPlayers && oldPlayers.length > 0 && !isLoading) ? (
                <div className="app-shell min-h-[100dvh] bg-[#0a0a0f] text-gray-100 font-sans flex flex-col items-center justify-center px-4 py-10">
                    <Lobby players={players}/>
                </div>
            ) : (isGameEnded && !isEditingRoom && oldPlayers && oldPlayers.length > 0) ? (
                <EndGame players={players} creator={creator} username={userName} setIsEditingRoom={setIsEditingRoom}
                         isEditingRoom={isEditingRoom} handleRestartGame={handleRestartGame}
                         handleJoinRoom={handleJoinRoom} oldPlayers={oldPlayers} handleLeaveGame={handleLeaveGame} xpEarned={xpEarned} setXpEarned={setXpEarned} winner={winner}/>
            ) : isPlayerBan === false && (
                <div
                    className="app-shell bg-neutral-900 h-[var(--app-h)] md:h-screen flex flex-col md:flex-row md:items-center md:justify-center relative overflow-hidden text-white font-sans">

                    {/* CONTAINER DE L'APPLICATION */}
                    <div
                        className="w-full h-full md:w-full md:h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1b26] via-[#0f0f18] to-black">

                    <GameHeader timeLeft={timeLeft} currentUser={userName} userObject={userObject} creator={creator} handleStartGame={handleStartGame} setIsEditingRoom={setIsEditingRoom} isEditingRoom={isEditingRoom} isGameRunning={isGameRunning} timerVisible={timerVisible} setIsConsult={setIsConsultRules} isConsult={isConsultRules} handleJoinRoom={handleJoinRoom} handleLeaveGame={handleLeaveGame} players={players} gameStartingSoonTimer={gameStartingSoonTimer} handleCancelStartGame={handleCancelStartGame} setStartTimer={setStartTimer} setTimeLeft={setTimeLeft} startTimer={startTimer} endsAt={endsAt}
                        />

                        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden relative">
                            <Leaderboard players={players} scoreToWin={scoreToWin} username={userName}/>

                            {response != '' ?
                                <div className="flex-1 min-h-0 min-w-0 justify-center flex flex-col relative z-10 overflow-y-auto">
                                    <DisplayResponse response={response} question={question} story={questionStory} firstResponsePlayer={firstResponsePlayer}/>
                                    <Jokers jokers={jokersLeft} handleUseJoker={handleUseJoker} activesItems={activesItems} itemsEnabled={itemsEnabled}/>
                                </div> :
                                <GameArea
                                    hasGuessed={hasGuessed}
                                    timeLeft={timeLeft}
                                    question={question}
                                    theme={questionTheme}
                                    imageUrl={imageUrl}
                                    isCreator={!!creator && creator.toLowerCase().trim() === userName?.toLowerCase().trim()}
                                    lobbyActions={!isGameRunning && (
                                        <GameActions
                                            variant="stack"
                                            currentUser={userName}
                                            creator={creator}
                                            players={players}
                                            isGameRunning={isGameRunning}
                                            isStartingSoon={gameStartingSoonTimer !== -1}
                                            onRules={() => setIsConsultRules(true)}
                                            onEdit={() => setIsEditingRoom(true)}
                                            onStart={handleStartGame}
                                            onCancelStart={handleCancelStartGame}
                                            onJoin={handleJoinRoom}
                                            onLeave={handleLeaveGame}
                                        />
                                    )}
                                    countdownAction={
                                        <GameActions
                                            variant="stack"
                                            currentUser={userName}
                                            creator={creator}
                                            players={players}
                                            isGameRunning={isGameRunning}
                                            isStartingSoon={true}
                                            onCancelStart={handleCancelStartGame}
                                        />
                                    }
                                    gameStartingSoonTimer={gameStartingSoonTimer}
                                    activesItems={activesItems}
                                    jokersLeft={jokersLeft}
                                    handleUseJoker={handleUseJoker}
                                    hint={hint}
                                    activeInk={activeInk}
                                />
                            }
                            <Chat
                                players={players}
                                messages={messages}
                                userName={userName}
                                onSendMessage={handleChatMessage}
                                creator={creator}
                                socket={socket}
                                roomId={roomId}
                                roomData={roomData}
                                setRoomData={setRoomData}
                            />
                        </div>

                        <GameInput
                            isMobileChatOpen={isMobileChatOpen}
                            setIsMobileChatOpen={setIsMobileChatOpen}
                            messages={messages}
                            onSendGuess={handleGameGuess}
                            onSendChat={handleChatMessage}
                            hasGuessed={hasGuessed}
                            players={players}
                            username={userName}
                            focusInputResponse={focusInputResponse}
                            setFocusInputResponse={setFocusInputResponse}
                            timerVisible={timerVisible}
                            guessVal={guessVal}
                            setGuessVal={setGuessVal}
                            roomPanel={
                                <RoomPanel
                                    players={players}
                                    userName={userName}
                                    creator={creator}
                                    socket={socket}
                                    roomId={roomId}
                                    roomData={roomData}
                                    setRoomData={setRoomData}
                                />
                            }
                        />

                    </div>
                </div>
            )}
        </>
    );
};

export default GameView;
