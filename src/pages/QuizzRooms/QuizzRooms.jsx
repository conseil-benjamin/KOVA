import {useEffect, useState} from "react";
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
import Swal from 'sweetalert2'
import {useNavigate} from "react-router-dom";

function QuizzRooms(){
    const [rooms, setRooms] = useState([]);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            const response = await fetch('http://localhost:5000/api/v1/rooms/quizz');
            const data = await response.json();
            console.log(data);
            setRooms(data);
        }
        fetchRooms();
    }, []);

    useEffect(() => {
        socket.on('roomData', (data) => {
            const roomCode = data.roomCode;
            navigate(`/jeu/quizz/${roomCode}`);
        });

        return () => {
            socket.off('roomData');
        };
    }, [socket]);

    const joinRoom = (roomCode, roomName) => {
        if (roomCode && username) {
            socket.emit('joinRoom', { roomCode, roomName, username, gameType: 'quizz' });
        } else if (roomCode && !username) {
           Swal.fire({
                title: 'Entrer un pseudo',
                input: 'text',
                inputLabel: 'Pseudo',
                inputPlaceholder: 'Entrer un pseudo',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Vous devez choisir un pseudo'
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    setUsername(result.value);
                    localStorage.setItem('username', result.value);
                    navigate(`/jeu/quizz/${roomCode}`);
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a username',
            })
           }
        }

    return (
        <div className={'bg-gray-900 h-screen text-white'}>
            <h1>QuizzRooms</h1>
            <ul>
                {rooms && rooms.map((room, index) => (
                    !room.private && (
                        <div key={index} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            backgroundColor: "red",
                            cursor: "pointer",
                            margin: "0 0 2em 0"
                        }} onClick={() => joinRoom(room.roomCode, room.roomName)}>
                            <p>{room.roomName}</p>
                            <p>{room.users.length}</p>
                        </div>
                    )
                ))}
            </ul>
        </div>
    )
}

export default QuizzRooms;
