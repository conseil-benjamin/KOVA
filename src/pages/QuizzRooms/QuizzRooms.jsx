import {useEffect, useState} from "react";
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
import Swal from 'sweetalert2'
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

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
            console.log('Message received from server:');
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
                    const usernameSwal = result.value;
                    console.log(usernameSwal);
                    socket.emit('joinRoom', { roomCode, roomName, usernameSwal, gameType: 'quizz' });
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
        <div style={{backgroundColor: "#344E41", color: "white", textAlign: "center"}}>
            <h2 className={'text-2xl'}>Parties publiques</h2>
            <div className={'flex flex-row justify-center items-center h-screen w-full text-white'}>
                {rooms.length > 0 ? rooms.map((room, index) => (
                    !room.private && (
                        <div key={index} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            backgroundColor: "green",
                            cursor: "pointer",
                            margin: "0 0 2em 1em",
                            padding: "1em",
                            borderRadius: "10px",
                            maxWidth: "15%",
                        }} onClick={() => joinRoom(room.roomCode, room.roomName)}>
                            <p>{room.roomName}</p>
                            <div className={'flex flex-row justify-center items-center'}>
                                <FontAwesomeIcon icon={faUser}/>
                                <p className={'pl-2'}>{room.users.length}</p>
                            </div>
                            {room.gameType === 'quizz' ? (
                                <img src={'https://www.shutterstock.com/shutterstock/photos/2052894734/display_1500/stock-vector-quiz-and-question-marks-trivia-night-quiz-symbol-neon-sign-night-online-game-with-questions-2052894734.jpg'} alt="Quiz Image" />
                            ) : (
                                <div>
                                    <img src={'https://eagles-team-experiences.com/wp-content/uploads/2022/04/Blind-Test-Musical.jpg'} alt="Blindtest Image" />
                                    Blindtest
                                </div>
                            )}
                        </div>
                    )
                )) : <div className={'flex justify-center items-center h-screen flex-col'}>
                    <h1 className={'text-center text-xl'}>Aucune partie publique pour le moment ! N'hésitez pas à en créer une.</h1>
                    <button className={'bg-amber-900 p-2 rounded m-5'} onClick={() => navigate(`/jouer`)}>Accueil</button>
                </div>}
        </div>
        </div>
    )
}

export default QuizzRooms;
