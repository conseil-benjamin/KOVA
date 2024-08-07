import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import io from 'socket.io-client';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
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

    const sendMessage = (message) => {
        if (message) {
            socket.emit('sendMessage', { roomName, roomCode, username, text: message });
        }
    };

    useEffect(() => {
        socket.on('roomData', (data) => {
            console.log('Message received from server:');
            console.log('Room data:', data);
            console.log('Room:', room);
            setRoom(data);
            console.log('Room:', room);
        });

        socket.on('messageInGame', (message) => {
            console.log('test');
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
        // TODO : J'ai l'impression que l'emit est fait trop tôt et donc quand le setTimeout est fini, la question étant déjà envoyée le timer n'est pas à 20 mais à 14 du coup
        if (remainingTime === 0) {
            asyncFunction().then(r => socket.emit('getQuestion', { roomCode }));
        }
    }, [remainingTime]);

    const displayAnswer = (answer) => {
        setAnswerVisible(true);
        setTimeout(() => {
            setAnswerVisible(false);
        }, 5000);
    }

    const leaveRoom = () => {
        console.log('leave room')
        socket.emit('leaveRoom', { roomCode, username });
        navigate('/jeu/quizz-rooms');
    };

    const checkAnswer = () => {
        if (response === question.correctAnswer) {
            console.log('correct');
        } else {
            console.log('incorrect');
        }
    }

    const UserCard = ({ user }) => (
        <div className="bg-amber-200 rounded-lg shadow-md p-4 flex items-center space-x-6">
            <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faUser} size={"2x"}/>
            </div>
            <div>
                <div className="text-xl font-medium text-black">{user.username}</div>
                <div className="text-gray-500">{user.points}</div>
            </div>
        </div>
    );

    const Messagerie = ({room, sendMessage}) => {
        const [message, setMessage] = useState('');

        return(
            <div className={'flex flex-col justify-between bg-yellow-600 p-5 h-screen'}>
                    <ul id="messages">
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
    };

    const Quizz = ({room}) => {
        const [response, setResponse] = useState('');
        return(
        <>
            {room.users && room.users.length > 1 ? (
                question && Object.keys(question).length > 0 ? (
                    <div className={'flex w-2/3 h-screen items-center justify-center flex-col mt-5'}>
                        <div className={'w-2/3 h-1/2'}>
                            {answerVisible ? (<div>
                                    <h1 className={'text-center font-bold text-3xl'}>{question.correctAnswer}</h1>
                                <h2 className={'text-center'}>{question.explicationReponse}</h2>
                            </div>) : (
                                <>
                                <h2 className={'text-center bg-amber-900'}>{question.question}</h2>
                                <Timer timeQuestionBegin={question.time} baseTime={limitTime}
                                                                         setRemainingTime={setRemainingTime} remainingTime={remainingTime}/>
                                {question.questionImage ? (
                        <div className={'w-full h-full flex items-center justify-center'}>
                            <img
                                src={question.elementQuestion}
                                className={'object-contain max-w-full max-h-full'}/>
                        </div>
                        ) : <h4>{question.elementQuestion}</h4>}
                                </>
                            )}
                        </div>
                        <div className={'flex items-end justify-center w-full h-full'}>
                            <input onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    checkAnswer();
                                    setResponse('');
                                }
                            }} value={response} onChange={(e) => setResponse(e.target.value)} type={'text'}
                                   className={'bg-gray-600 p-2 rounded-md w-2/3 text-center '}/>
                        </div>
                    </div>
                ) :
                    (
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
        )
    }

    return (
        <div className={'flex items-end justify-end bg-gray-900 h-screen text-white'}>
            <div className={'flex flex-row w-screen'}>
            {room && Object.keys(room).length > 0 ? (
                    <div className={'flex flex-row justify-end items-end w-screen'}>
                        <Rules acceptShortcuts={acceptShortcuts} limitScore={limitScore} limitTime={limitTime}
                               setAcceptShortcuts={setAcceptShortcuts} setLimitScore={setLimitScore}
                               setLimitTime={setLimitTime} seeOtherAnswers={seeOtherAnswers}
                               setSeeOtherAnswers={setSeeOtherAnswers} rulesVisible={rulesVisible}/>
                        <Quizz room={room}/>
                        <div className="p-2 bg-amber-900 min-h-screen flex justify-between flex-col">
                            <ul className="space-y-4">
                                {room.users && room.users.map((user, index) => (
                                    <li key={index}>
                                        <UserCard user={user}/>
                                    </li>
                                ))}
                            </ul>
                            <button className={'w-full bg-red-500 p-2 rounded-md'} onClick={leaveRoom}>Quitter la
                                partie
                            </button>
                            <button className={'w-full bg-blue-500 p-2 rounded-md'} onClick={() => setRulesVisible(!rulesVisible)}>Règles</button>
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
