import {useEffect, useState, useCallback, useMemo, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import io from 'socket.io-client';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faCrown} from "@fortawesome/free-solid-svg-icons";
import Timer from "./Timer.jsx";
import Rules from "./Rules.jsx";
const socket = io('http://localhost:5000');

function QuizzGame() {
    const [room, setRoom] = useState({});
    const {roomCode} = useParams();
    const [roomName, setRoomName] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState({});
    const [limitScore, setLimitScore] = useState(100);
    const [limitTime, setLimitTime] = useState(20);
    const [remainingTime, setRemainingTime] = useState(null);
    const [seeOtherAnswers, setSeeOtherAnswers] = useState(false);
    const [acceptShortcuts, setAcceptShortcuts] = useState(false);
    const [rulesVisible, setRulesVisible] = useState(false);
    const [answerVisible, setAnswerVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/v1/rooms/room/${roomCode}`);
            const data = await response.json();
            if (data.length === 0) {
                navigate('/jeu/quizz-rooms');
            } else {
                if (!username) {
                    const usernameSwal = prompt('Entrez votre pseudo');
                    setUsername(usernameSwal);
                    localStorage.setItem('username', usernameSwal);
                    socket.emit('joinRoom', { roomCode, roomName, usernameSwal, gameType: 'quizz' });
                } else {
                    socket.emit('joinRoom', { roomCode, roomName, username, gameType: 'quizz' });
                }
                console.log(data);
                setRoom(data[0]);
                setRoomName(data.roomName);
                setQuestion(data.currentQuestion);
                setLimitTime(data[0].rules.limitTime);
                setLimitScore(data[0].rules.limitScore);
                setRemainingTime(data[0].rules.limitTime);
            }
        }
        fetchRooms();
    }, []);

    const sendMessage = useCallback((message) => {
        if (message) {
            socket.emit('sendMessage', { roomName, roomCode, username, text: message });
        }
    }, [roomName, roomCode, username]);

    useEffect(() => {
        socket.on('roomData', (data) => {
            console.log('Message received from server:');
            console.log('Room data:', data);
            console.log('Room:', room);
            setRoom(data);
            console.log('Room:', room);
        });

        socket.on('messageInGame', (message) => {
            setRoom((prevRoom) => {
                return {
                    ...prevRoom,
                    messages: [...prevRoom.messages, message]
                };
            });
        });

        socket.on('message', (message) => {
            console.log('Message received from server:');
            console.log('Message:', message);
        })

        socket.on('gameStarting', (data) => {
            console.log(data)
            setLimitTime(data.rules.limitTime);
            setLimitScore(data.rules.limitScore);
            setRemainingTime(data.rules.limitTime);
            console.log('game startinggggggggggggggggggggggggggggg');
            socket.emit('getQuestion', { roomCode });
        });

        socket.on('question', (question) => {
            console.log(question);
            setQuestion(question);
        });

        return () => {
            socket.off('roomData');
            socket.off('gameStart');
        };
    }, [socket]);

    useEffect(() => {
        const asyncFunction = async () => {
            await displayAnswer();
        }
        if (remainingTime === 0) {
            setAnswerVisible(true)
            asyncFunction();
        }
    }, [remainingTime]);

    const displayAnswer = (() => {
        setTimeout(() => {
            setAnswerVisible(false);
            console.log('answerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
            socket.emit('getQuestion', { roomCode });
        }, 5000);
    });

    const leaveRoom = useCallback(() => {
        // TODO : Ne quitte pas vraiment la room quand on est maitre de partie (le socket est toujours connecté)
        console.log('leave room')
        socket.emit('leaveRoom', { roomCode, username });
        navigate('/jeu/quizz-rooms');
    }, [roomCode, username, navigate]);

    const checkAnswer = useCallback((response) => {
        if (response === question.correctAnswer) {
            console.log('correct');
        } else {
            console.log('incorrect');
        }
    }, [question]);

    const UserCard = useCallback(({ user }) => (
        <div className="rounded-lg shadow-md p-4 flex items-center space-x-6" style={{backgroundColor: "#A3B18A"}}>
            {user.owner &&
                <div style={{display: "flex", alignItems: "end", justifyContent: "end"}}>
                    <FontAwesomeIcon icon={faCrown} size={"1x"} className={'text-yellow-500'}/>
                </div>
            }
            <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faUser} size={"2x"}/>
            </div>
            <div>
                <div className="text-xl font-medium text-black">{user.username}</div>
                <div className="text-gray-500">{user.points}</div>
            </div>
        </div>
    ), []);

    const Messagerie = useCallback(({room, sendMessage}) => {
        const [message, setMessage] = useState('');

        return(
            <div className={'flex flex-col justify-between p-5 h-screen'} style={{backgroundColor: "#DAD7CD", color: "black"}}>
                <ul className={'overflow-auto mb-2'} id="messages">
                    {room.messages && room.messages.map((msg, index) => (
                        <li key={index}>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })} <b>{msg.username}</b>: <b>{msg.text}</b>
                        </li>
                    ))}
                </ul>
                <div className={'flex items-end'}>
                    <input
                        className={'w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400'}
                        type="text"
                        placeholder="Ecrivez ici pour discuter."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage(message);
                                setMessage('');
                            }
                        }}
                    />
                </div>
            </div>
        )
    }, []);

    const Quizz = useMemo(() => {
        return ({ room }) => {
            const [response, setResponse] = useState('');

            return (
                <>
                    {room.users && room.users.length > 1 ? (
                        question && Object.keys(question).length > 0 ? (
                            <div className={'flex w-2/3 h-screen items-center flex-col mt-5'}>
                                <div className={'w-2/3 h-1/2 flex items-center justify-end flex-col'}>
                                    {answerVisible ? (
                                        <div>
                                            <h1 className={'text-center font-bold text-3xl'}>{question.correctAnswer}</h1>
                                            <h2 className={'text-center'}>{question.explicationReponse}</h2>
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className={'text-center font-bold text-2xl'}>{question.question}</h1>
                                            <Timer timeQuestionBegin={question.time} baseTime={limitTime}
                                                   setRemainingTime={setRemainingTime} remainingTime={remainingTime}/>
                                            {question.questionImage ? (
                                                <div className={'w-full h-full flex items-center justify-center'}>
                                                    <img
                                                        src={question.elementQuestion}
                                                        className={'object-contain max-w-full max-h-full'}/>
                                                </div>
                                            ) : <h4 className={'text-xl'}>{question.elementQuestion}</h4>}
                                        </>
                                    )}
                                </div>
                                <div className={'flex items-end justify-end h-1/2 w-full'}>
                                    <input onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            checkAnswer(responseRef.current);
                                            setResponse('');
                                        }
                                    }} value={response} onChange={(e) => setResponse(e.target.value)} type={'text'}
                                           className={'p-2 rounded-md w-full text-center mb-2 ml-10 mr-10 font-black text-black'} style={{backgroundColor: "#DAD7CD"}}/>
                                </div>
                            </div>
                        ) : (
                            room.users.some(user => user.username === username && user.owner) ? (
                                <div className={'flex w-2/3 h-screen items-center justify-center flex-col'}>
                                    <button onClick={() => socket.emit('gameStart', {roomCode, limitTime, limitScore, seeOtherAnswers, acceptShortcuts})}
                                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
                                        Lancer la partie
                                    </button>
                                </div>
                            ) : (
                                <div className={'flex w-2/3 h-screen items-center justify-center flex-col'}>
                                    <h1>En attente du lancement de la partie ...</h1>
                                </div>
                            )
                        )
                    ) : <div className={'flex w-2/3 h-screen items-center justify-center flex-col'}>
                        <h2 className={'text-center'}>En attente d'autres joueurs...</h2>
                    </div>
                    }
                </>
            );
        };
    }, [question, answerVisible, limitTime, remainingTime, checkAnswer, username]);

    return (
        <div className={'flex items-end justify-end h-screen text-white'} style={{backgroundColor: "#344E41"}}>
            <div className={'flex flex-row w-screen'}>
                {room && Object.keys(room).length > 0 ? (
                    <div className={'flex flex-row justify-end items-end w-screen'}>
                        <Rules acceptShortcuts={acceptShortcuts} limitScore={limitScore} limitTime={limitTime}
                               setAcceptShortcuts={setAcceptShortcuts} setLimitScore={setLimitScore}
                               setLimitTime={setLimitTime} seeOtherAnswers={seeOtherAnswers}
                               setSeeOtherAnswers={setSeeOtherAnswers} rulesVisible={rulesVisible}/>
                        <Quizz room={room}/>
                        <div className="p-2 min-h-screen flex justify-between flex-col"
                             style={{backgroundColor: "#588157"}}>
                            <ul className="space-y-4">
                                {room.users && room.users.map((user, index) => (
                                    <li key={index}>
                                        <UserCard user={user}/>
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <button className={'w-full bg-red-500 p-2 rounded-md'} onClick={leaveRoom}>Quitter la
                                    partie
                                </button>
                                <button className={'w-full p-2 rounded-md mt-2'} style={{backgroundColor: "#A3B18A"}}
                                        onClick={() => setRulesVisible(!rulesVisible)}>Règles
                                </button>
                            </div>
                        </div>
                        <Messagerie room={room} sendMessage={sendMessage}/>
                    </div>
                ) : !loading && (
                    <div className={'flex flex-col items-center justify-center'}>
                        <p className={'text-center'}>Room not found</p>
                        <button onClick={() => navigate("/")}
                                className={'cursor-pointer bg-yellow-600 p-2 rounded-md mt-2'}>
                            Retour à la liste des salles
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizzGame;