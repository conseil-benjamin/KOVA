"use client";
import { Button } from "@/components/ui/button"
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoginForm } from "@/components/login-form";
import { Input } from "@/components/ui/input";
import { SignupForm } from "@/components/signup-form";

export default function Home() {
  const handleClick = () => {
    alert("clicked")
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      {/* 4. RENDU CONDITIONNEL : On affiche l'Alert SEULEMENT si isConnected est true */}
      {/*isConnected && (
        <Alert className="border-green-500 bg-green-500/10 text-green-400 animate-in fade-in slide-in-from-top-2">
          <AlertTitle>Succès !</AlertTitle>
          <AlertDescription>
            Le socket communique bien avec le serveur. <br />
            <span className="text-xs opacity-70 font-mono">Message reçu : {lastMessage}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Exemple d'une alerte d'info permanente (état "En attente") */}
      {/*!isConnected && (
        <Alert className="border-slate-700 bg-slate-800 text-slate-400">
          <AlertTitle>En attente...</AlertTitle>
          <AlertDescription>
            Connexion au serveur Socket.io en cours...
          </AlertDescription>
        </Alert>
      )*/}

      {/* <LoginForm /> */}
      <SignupForm />

      <Button onClick={handleClick}>Click me</Button>
    </div>
  )
}