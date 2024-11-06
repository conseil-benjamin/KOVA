import pendu from "../../assets/pendu.jpg";
import quizz from "../../assets/quizz.jpg";
import blindtest from "../../assets/blindtest.jpg";
import React, {useEffect, useState} from "react";
import Swal from 'sweetalert2'
import {useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronCircleLeft} from "@fortawesome/free-solid-svg-icons";
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

function Jeux() {
    const navigate = useNavigate();
    const [gameType, setGameType] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

    useEffect(() => {
        socket.on('roomData', (data) => {
            const roomCode = data.roomCode;
            navigate(`/jeu/quizz/${roomCode}`); // a changer le quizz en dur
        });
        socket.on('message', (message) => {
            console.log('Message received from server:');
            console.log('Message:', message);
        });
    }, [socket]);

    const createQuizzRoom = (game) => {
        Swal.fire({
            title: 'Créer une partie',
            html: `
    <input id="swal-input1" class="swal2-input" placeholder="Nom de la partie">
    <div>
        <input type="checkbox" id="swal-input2" class="swal2-checkbox" placeholder="Partie privée">
        <label>Partie privée</label>
    </div>
`,
            focusConfirm: false,
            showCloseButton: true,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').checked
                ]
            }
        }).then((result) => {
            if (result.isConfirmed) {
                checkUsername();
                const roomName = result.value[0];
                const privateRoom = result.value[1];
                if (roomName) {
                    socket.emit('createRoom', {roomName, username, privateRoom, game});
                } else {
                    Swal.fire({
                        icon: 'error',
                        inputAttributes: {
                            autoComplete: 'off' // Désactive l'autocomplétion
                        },
                        title: 'Oops...',
                        text: 'Veuillez entrer un nom de partie',
                    })
                }
            }
        })
    }

    const checkUsername = () => {
        if (!username) {
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
                }
            });
        }
    }

    const handleClickJoinRooms = (game) => {
        navigate(`/jeu/${game}-rooms`);
    }

    return (
        <div className={'h-screen'} style={{backgroundColor: "#344E41"}}>
            <button onClick={() => navigate('/')}
                className={'rounded-md pl-6 pr-6 pt-2 pb-2 text-black mt-5 cursor-pointer hover:bg-red-500 hover:text-white text-white'}>
                <FontAwesomeIcon icon={faChevronCircleLeft} className={'mr-2'}/>
                Retour
            </button>
            <h2 className={'text-white text-center text-5xl'}>Choix du jeu</h2>
            <div className={'flex flex-row justify-around items-center'}>
                <div className={'flex flex-col'}>
                    <h4 className={'text-white text-center text-3xl'}>Le jeu du pendu</h4>
                    <img src={pendu} alt="pendu"
                         className="h-80 w-full object-cover rounded-lg"/>
                    <button
                        className={'bg-yellow-600 rounded-md pl-6 pr-6 pt-2 pb-2 text-black mt-5 cursor-pointer hover:bg-red-500 hover:text-white'}>Jouer
                    </button>
                </div>
                <div className={'flex flex-col'}>
                    <h4 className={'text-white text-center text-3xl'}>PopSauce</h4>
                    <img src={quizz} alt="quizz" className="h-80 w-full object-cover rounded-lg"/>
                    <div className={'flex flex-row w-auto'}>
                        <button onClick={() => createQuizzRoom('quizz')}
                            className={'bg-yellow-600 rounded-md pl-6 pr-6 pt-2 pb-2 text-black mt-5 cursor-pointer hover:bg-red-500 hover:text-white mr-3'}>Créer
                            une partie
                        </button>
                        <button
                            onClick={() => handleClickJoinRooms("quizz")}
                            className={'bg-yellow-600 rounded-md pl-6 pr-6 pt-2 pb-2 text-black mt-5 cursor-pointer hover:bg-red-500 hover:text-white'}>Rejoindre
                            une partie
                        </button>
                    </div>
                </div>
                <div className={'flex flex-col'}>
                    <h4 className={'text-white text-center text-3xl'}>Blindtest</h4>
                    <img src={blindtest} alt="blindtest" className="h-80 w-full object-cover rounded-lg"/>
                    <div className={'flex flex-row w-auto'}>
                        <button
                            className={'bg-yellow-600 rounded-md pl-6 pr-6 pt-2 pb-2 text-black mt-5 cursor-pointer hover:bg-red-500 hover:text-white mr-3'}>Créer
                            une partie
                        </button>
                        <button
                            onClick={() => handleClickJoinRooms("blindtest")}
                            className={'bg-yellow-600 rounded-md pl-6 pr-6 pt-2 pb-2 text-black mt-5 cursor-pointer hover:bg-red-500 hover:text-white'}>Rejoindre une partie
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jeux
