import {useEffect, useState} from "react";
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

function BlindtestRooms(){
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const response = await fetch('http://localhost:5000/rooms/blindtest');
            const data = await response.json();
            console.log(data);
            setRooms(data);
        }
        fetchRooms();
    }, []);

    return(
        <div className={'bg-gray-900 h-screen'}>
            <h1>BlindtestRooms</h1>
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
                        }}>
                            <p>{room.roomName}</p>
                            <p>{room.users.length}</p>
                        </div>
                    )
                ))}
            </ul>
        </div>
    )
}

export default BlindtestRooms;
