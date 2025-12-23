"use client";
import { Button } from "@/components/ui/button"
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState('');

  useEffect(() => {
    //fetchData();
    // Establish WebSocket connection to your backend
    const socket = io('http://localhost:3333');

    //listen to ping sent by socket.io
    socket.on('ping', (data) => {
      console.log(data)
      setIsConnected(true);
      setLastMessage(JSON.stringify(data));
    })

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleClick = () => {
    alert("clicked")
  }

  return (
    <div>
      {/* 4. RENDU CONDITIONNEL : On affiche l'Alert SEULEMENT si isConnected est true */}
      {isConnected && (
        <Alert className="border-green-500 bg-green-500/10 text-green-400 animate-in fade-in slide-in-from-top-2">
          <AlertTitle>Succès !</AlertTitle>
          <AlertDescription>
            Le socket communique bien avec le serveur. <br />
            <span className="text-xs opacity-70 font-mono">Message reçu : {lastMessage}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Exemple d'une alerte d'info permanente (état "En attente") */}
      {!isConnected && (
        <Alert className="border-slate-700 bg-slate-800 text-slate-400">
          <AlertTitle>En attente...</AlertTitle>
          <AlertDescription>
            Connexion au serveur Socket.io en cours...
          </AlertDescription>
        </Alert>
      )}

      <Button onClick={handleClick}>Click me</Button>
    </div>
  )
}