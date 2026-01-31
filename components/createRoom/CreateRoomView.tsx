"use client";

import React, { useState } from 'react';
import { packs } from './constants';
import CreateRoomHeader from './CreateRoomHeader';
import CreateRoomFooter from './CreateRoomFooter';
import RoomNameSection from './RoomNameSection';
import PacksSection from './PacksSection';
import ContentOptionsSection from './ContentOptionsSection';
import VictoryConditionsSection from './VictoryConditionsSection';
import JokersSection from './JokersSection';
import PrivacySection from './PrivacySection';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import Cookies from "universal-cookie";

const CreateRoomView = () => {
    const cookies = new Cookies();

    // --- ÉTAT DU FORMULAIRE ---
    const [language, setLanguage] = useState<'fr' | 'en'>('fr');
    const [selectedPack, setSelectedPack] = useState("Le Grand Mix KOVA #1"); // 'mix' ou id spécifique
    const [isPrivate, setIsPrivate] = useState(false);
    const [userName, setUserName] = useState(cookies.get('userName') || ''); // todo: vérifier si le user est connecté
    const [roomName, setRoomName] = useState(`La Room de ${userName}`);


    // Règles
    const [maxPlayers, setMaxPlayers] = useState(12);
    const [scoreToWin, setScoreToWin] = useState(10000);
    const [timePerRound, setTimePerRound] = useState(15);

    // Options de contenu
    const [enableBlindTest, setEnableBlindTest] = useState(true); // Son activé ?
    const [enableNSFW, setEnableNSFW] = useState(false); // Contenu adulte ?

    // Jokers / Items
    const [itemsEnabled, setItemsEnabled] = useState(true);
    const [activeItems, setActiveItems] = useState({
        hint: true,   // Indice
        freeze: true, // Geler le temps
        ink: true,    // Tache d'encre
        swap: false   // Échanger les scores (Chaotique)
    });

    const toggleItem = (key: keyof typeof activeItems) => {
        setActiveItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const currentPack = packs.find(p => p.id === selectedPack);

    const launchRoom = async () => {
        const roomData = {
            language,
            name: roomName,
            pack: selectedPack, // nom du pack
            isPrivate, // boolean
            creator: userName,
            maxPlayers, // int
            scoreToWin, // int
            timePerRound, // int
            enableBlindTest, // boolean
            enableNSFW,  // boolean
            itemsEnabled, // boolean
            activeItems, // object
            timer: timePerRound,
        };

        const result = await fetch('http://localhost:3333/launch-room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(roomData),
        }).then(async (res) => {
            if (res.ok) {
                toast.success('Room created');
                const roomId = await res.text();
                console.log("Room ID:", roomId);
                redirect(`/${roomId}`);
            } else {
                toast.error('Room not created');
            }
        });
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col">

            {/* --- HEADER --- */}
            <CreateRoomHeader />

            <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- COLONNE GAUCHE (Contenu & Packs) --- */}
                <div className="lg:col-span-7 space-y-8">

                    {/* 1. Nom de la Room */}
                    <RoomNameSection
                        roomName={roomName}
                        setRoomName={setRoomName}
                        language={language}
                        setLanguage={setLanguage}
                    />

                    {/* 2. Sélection du Pack */}
                    <PacksSection selectedPack={selectedPack} setSelectedPack={setSelectedPack} />

                    {/* 3. Options de Contenu */}
                    <ContentOptionsSection
                        enableBlindTest={enableBlindTest} setEnableBlindTest={setEnableBlindTest}
                        enableNSFW={enableNSFW} setEnableNSFW={setEnableNSFW}
                    />

                </div>

                {/* --- COLONNE DROITE (Règles & Jokers) --- */}
                <div className="lg:col-span-5 space-y-8">

                    {/* 4. Règles du Jeu (Sliders) */}
                    <VictoryConditionsSection
                        scoreToWin={scoreToWin} setScoreToWin={setScoreToWin}
                        timePerRound={timePerRound} setTimePerRound={setTimePerRound}
                        maxPlayers={maxPlayers} setMaxPlayers={setMaxPlayers}
                    />

                    {/* 5. Configuration des Jokers */}
                    <JokersSection
                        itemsEnabled={itemsEnabled} setItemsEnabled={setItemsEnabled}
                        activeItems={activeItems} toggleItem={toggleItem}
                    />

                    {/* 6. Confidentialité */}
                    <PrivacySection isPrivate={isPrivate} setIsPrivate={setIsPrivate} />

                </div>
            </main>

            {/* --- STICKY FOOTER (Action) --- */}
            <CreateRoomFooter selectedPackName={currentPack?.name} launchRoom={launchRoom} />

        </div>
    );
};

export default CreateRoomView;
