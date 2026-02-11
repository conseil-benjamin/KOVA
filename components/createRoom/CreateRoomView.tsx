"use client";

import React, { useEffect, useState } from 'react';
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
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@radix-ui/react-alert-dialog';
import { AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog';
import { Room, Player } from '@/types/Room';

const CreateRoomView = ({ socket, setIsEditing, isEditing, dataRoom, setRoomData, setIsConsult, isConsult, creator }: { socket: any, setIsEditing: (isEditing: boolean) => void, isEditing: boolean, dataRoom?: Room, setRoomData: (dataRoom: Room) => void, setIsConsult: (isConsult: boolean) => void, isConsult: boolean, creator?: string }) => {
    const cookies = new Cookies();

    // --- ÉTAT DU FORMULAIRE ---
    const [language, setLanguage] = useState<'fr' | 'en'>('fr');
    const [selectedPack, setSelectedPack] = useState("Le Grand Mix KOVA #1");
    const [isPrivate, setIsPrivate] = useState(false);
    const [userName, setUserName] = useState(cookies.get('userName') || '');
    const [roomName, setRoomName] = useState(`La Room de ${userName}`);
    const [isLoading, setIsLoading] = useState(false);

    // Règles
    const [maxPlayers, setMaxPlayers] = useState(12);
    const [scoreToWin, setScoreToWin] = useState(100);
    const [timePerRound, setTimePerRound] = useState(15);

    // Options de contenu
    const [enableBlindTest, setEnableBlindTest] = useState(false); // Son activé ?
    const [enableNSFW, setEnableNSFW] = useState(false); // Contenu adulte ?
    const [enableAbbreviations, setEnableAbbreviations] = useState(true); // Raccourcis ?
    const [enableShowWrongAnswers, setEnableShowWrongAnswers] = useState(true); // Afficher les réponses ?

    // Jokers / Items
    const [itemsEnabled, setItemsEnabled] = useState(true);
    const [activeItems, setActiveItems] = useState({
        hint: true,   // Indice
        freeze: true, // Geler le temps
        ink: true,    // Tache d'encre
        swap: false   // Échanger les scores (Chaotique)
    });

    const [guestNameInput, setGuestNameInput] = useState('');

    useEffect(() => {
        if (isEditing || isConsult) {
            setLanguage(dataRoom?.language || 'fr');
            setSelectedPack(dataRoom?.pack || "Le Grand Mix KOVA #1");
            setIsPrivate(dataRoom?.isPrivate || false);
            setRoomName(dataRoom?.name || `La Room de ${dataRoom?.creator}`);
            setMaxPlayers(dataRoom?.maxPlayers || 12);
            setScoreToWin(dataRoom?.scoreToWin || 10000);
            setTimePerRound(dataRoom?.timePerRound || 15);
            setEnableBlindTest(dataRoom?.enableBlindTest || false);
            setEnableNSFW(dataRoom?.enableNSFW || false);
            setEnableAbbreviations(dataRoom?.enableAbbreviations || true);
            setEnableShowWrongAnswers(dataRoom?.enableShowWrongAnswers || true);
            setItemsEnabled(dataRoom?.itemsEnabled || true);
        }
    }, [isEditing, dataRoom])

    const toggleItem = (key: keyof typeof activeItems) => {
        setActiveItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const currentPack = packs.find(p => p.id === selectedPack);

    const handleGuestLogin = async () => {
        setIsLoading(true);
        // todo : vérifier en bdd qu'aucun user ne possède déjà cette username
        const result = await fetch(`http://localhost:3333/users/${guestNameInput.trim()}`);
        if (result.status !== 200) {
            cookies.set('userName', guestNameInput.trim(), { path: '/' });
            setUserName(guestNameInput.trim());
        } else {
            toast.error('Username already exists');
            return;
        }
        setIsLoading(false);
    };

    const launchRoom = async () => {
        const roomData = {
            idUrl: "",
            language,
            name: roomName,
            pack: selectedPack, // nom du pack
            isPrivate, // boolean
            creator: userName,
            maxPlayers, // int
            players: [] as Player[], // array
            scoreToWin, // int
            timePerRound, // int
            enableBlindTest, // boolean
            enableNSFW,  // boolean
            itemsEnabled, // boolean
            activeItems, // object
            timer: timePerRound,
            enableAbbreviations,
            enableShowWrongAnswers,
        };

        if (isEditing) {
            roomData.idUrl = dataRoom?.idUrl || "";
            roomData.players = dataRoom?.players || [];
            console.log("Room data:", roomData);
            const result = await fetch(`http://localhost:3333/room/${dataRoom?.idUrl}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roomData),
            }).then(async (res) => {
                if (res.ok) {
                    const responseData = await res.json();
                    toast.success('Room updated');
                    let updatedRoomData = responseData;
                    if (responseData.roomData) {
                        updatedRoomData = typeof responseData.roomData === 'string'
                            ? JSON.parse(responseData.roomData)
                            : responseData.roomData;
                    }

                    socket.emit('need_update_room', updatedRoomData.idUrl);
                    setIsEditing(false);
                } else {
                    toast.error('Room not updated');
                }
            });
        } else {
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
    }

    return (
        <>
            {!userName && !isLoading ? (
                <div className="bg-neutral-900 min-h-screen h-[100dvh] md:h-screen flex flex-col md:flex-row md:items-center md:justify-center relative overflow-hidden text-white font-sans">
                    <AlertDialog open={true}>
                        <AlertDialogContent className="bg-neutral-900 border border-white/10 text-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Choisir un pseudo</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogDescription className="text-slate-400">
                                Veuillez choisir un pseudo pour vous identifier. Vous jouerez en mode invité.
                            </AlertDialogDescription>

                            <div className="py-4">
                                <input
                                    type="text"
                                    value={guestNameInput}
                                    onChange={(e) => setGuestNameInput(e.target.value)}
                                    placeholder="Votre pseudo..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    onKeyDown={(e) => e.key === 'Enter' && handleGuestLogin()}
                                />
                            </div>

                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-white/5 hover:bg-white/10 border-white/10 text-white hover:text-white" onClick={() => redirect('/')}>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleGuestLogin}
                                    disabled={!guestNameInput.trim()}
                                    className="bg-purple-600 hover:bg-purple-700 text-white border-0"
                                >
                                    Continuer
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ) : (

                <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col">

                    {/* --- HEADER --- */}
                    <CreateRoomHeader setIsEditing={setIsEditing} isEditing={isEditing} setIsConsult={setIsConsult} isConsult={isConsult} />

                    <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* --- COLONNE GAUCHE (Contenu & Packs) --- */}
                        <div className="lg:col-span-7 space-y-8">

                            {/* 1. Nom de la Room */}
                            <RoomNameSection
                                roomName={roomName}
                                setRoomName={setRoomName}
                                language={language}
                                setLanguage={setLanguage}
                                isConsult={isConsult}
                            />

                            {/* 2. Sélection du Pack */}
                            <PacksSection selectedPack={selectedPack} setSelectedPack={setSelectedPack} isConsult={isConsult} />

                            {/* 3. Options de Contenu */}
                            <ContentOptionsSection
                                enableBlindTest={enableBlindTest} setEnableBlindTest={setEnableBlindTest}
                                enableNSFW={enableNSFW} setEnableNSFW={setEnableNSFW}
                                enableAbbreviations={enableAbbreviations} setEnableAbbreviations={setEnableAbbreviations}
                                enableShowWrongAnswers={enableShowWrongAnswers} setEnableShowWrongAnswers={setEnableShowWrongAnswers}
                                isConsult={isConsult}
                            />

                        </div>

                        {/* --- COLONNE DROITE (Règles & Jokers) --- */}
                        <div className="lg:col-span-5 space-y-8">

                            {/* 4. Règles du Jeu (Sliders) */}
                            <VictoryConditionsSection
                                scoreToWin={scoreToWin} setScoreToWin={setScoreToWin}
                                timePerRound={timePerRound} setTimePerRound={setTimePerRound}
                                maxPlayers={maxPlayers} setMaxPlayers={setMaxPlayers}
                                isConsult={isConsult}
                            />

                            {/* 5. Configuration des Jokers */}
                            <JokersSection
                                itemsEnabled={itemsEnabled} setItemsEnabled={setItemsEnabled}
                                activeItems={activeItems} toggleItem={toggleItem}
                                isConsult={isConsult}
                            />

                            {/* 6. Confidentialité */}
                            <PrivacySection isPrivate={isPrivate} setIsPrivate={setIsPrivate} isConsult={isConsult} />

                        </div>
                    </main>

                    {/* --- STICKY FOOTER (Action) --- */}
                    <CreateRoomFooter selectedPackName={currentPack?.name} launchRoom={launchRoom} isEditing={isEditing} setIsEditing={setIsEditing} setIsConsult={setIsConsult} isConsult={isConsult} />

                </div>
            )
            }
        </>
    );
};

export default CreateRoomView;
