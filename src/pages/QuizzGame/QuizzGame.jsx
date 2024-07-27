import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import io from 'socket.io-client';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
const socket = io('http://localhost:5000');

function QuizzGame() {
    const [room, setRoom] = useState({ users: [], messages: []  });
    const {roomCode} = useParams();
    const [roomName, setRoomName] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/v1/rooms/room/${roomCode}`);
            const data = await response.json();
            console.log(data);
            setRoom(data);
            setRoomName(data[0].roomName);
        }
        fetchRooms();
    }, []);

    const sendMessage = (message) => {
        if (message) {
            socket.emit('sendMessage', { roomName, username, text: message });
        }
    };

    useEffect(() => {
        socket.on('message', (message) => {
            setRoom((prevRoom) => ({
                ...prevRoom,
                messages: [...prevRoom.messages, message]
            }));
        });

        socket.on('roomData', (room) => {
            setRoom(room);
        });
    }, []);

    const leaveRoom = () => {
        console.log('leave room')
        socket.emit('leaveRoom', { roomName, username });
    };

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
                        {room.messages.map((msg, index) => (
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

    const Quizz = ({room}) => (
        <>
        {room.users.length > 1 ?
            (
                <div className={'flex w-2/3 h-screen items-center flex-col'}>
                    <div className={'w-2/3'}>
                        <h2 className={'text-center bg-amber-900'}>What movie is this from ?</h2>
                        <img
                            src={"https://media.gqmagazine.fr/photos/622617a15f69a13708143038/16:9/w_1600,h_899,c_limit/avatar%20cover%202.jpg"}/>
                    </div>
                    <div className={'flex items-end justify-center w-full'}>
                        <input type={'text'} className={'bg-gray-600 p-2 rounded-md w-2/3 text-center '}/>
                    </div>
                </div>
            )
        :
            (
            <div className={'flex w-2/3 h-screen items-center justify-center flex-col'}>
                {/* attendre la fin de game si elle est déjà lancer pour afficher cette écran */}
                <h1 className={'text-3xl'}>En attente d'un joueur en plus</h1>
            </div>
        )}
</>
)

    return (
        <div className={'flex items-end justify-end bg-gray-900 h-screen text-white'}>
            <div className={'flex flex-row w-screen'}>
                {room.length > 0 ? room.map((room, index) => (
                    <div key={index} className={'flex flex-row justify-end items-end w-screen'}>
                            <Quizz room={room}/>
                        <div className="p-2 bg-amber-900 min-h-screen flex justify-between flex-col">
                            <ul className="space-y-4">
                                {room && room.users.map((user, index) => (
                                    <li key={index}>
                                        <UserCard user={user}/>
                                    </li>
                                ))}
                            </ul>
                            <button className={'w-full bg-red-500 p-2 rounded-md'} onClick={leaveRoom}>Quitter la
                                partie
                            </button>
                        </div>
                        <Messagerie room={room} sendMessage={sendMessage}/>
                    </div>
                )) : loading === false &&
                    (<div className={'flex flex-col items-center justify-center'}>
                <p className={'text-center'}>Room not found</p>
                    <button onClick={() => navigate("/")}
                            className={'cursor-pointer bg-yellow-600 p-2 rounded-md mt-2'}>Retour à la liste des
                        salles
                    </button>
                </div>)
                }
            </div>
        </div>
    );
}

export default QuizzGame;