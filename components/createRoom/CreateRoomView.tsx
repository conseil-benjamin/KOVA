"use client";

import React, { useEffect, useState } from 'react';
// import { packs } from './constants';
import CreateRoomHeader from './CreateRoomHeader';
import CreateRoomFooter from './CreateRoomFooter';
import RoomNameSection from './RoomNameSection';
import PacksSection from './PacksSection';
import DifficultySection from './DifficultySection';
import { defaultDifficulties } from './constants';
import ContentOptionsSection from './ContentOptionsSection';
import VictoryConditionsSection from './VictoryConditionsSection';
import JokersSection from './JokersSection';
import PrivacySection from './PrivacySection';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import Cookies from "universal-cookie";
import { AlertDialog, AlertDialogContent } from '../ui/alert-dialog';
import { Room, Player } from '@/types/Room';
import LoadingPage from '../loadingPage';
import SearchForMorePacks from '../Pack/SearchForMorePacks';
import RoomService from "@/services/roomService";
import UserService from "@/services/userService";
import ModalAskForPseudo from "@/components/ModalAskForPseudo";
import {Loader2Icon} from "lucide-react";

const CreateRoomView = ({ socket, setIsEditing, isEditing, dataRoom, setRoomData, setIsConsult, isConsult, creator }: { socket: any, setIsEditing: (isEditing: boolean) => void, isEditing: boolean, dataRoom?: Room, setRoomData: (dataRoom: Room) => void, setIsConsult: (isConsult: boolean) => void, isConsult: boolean, creator?: string }) => {
    const cookies = new Cookies();
    const roomService = new RoomService();
    const userService = new UserService();

    // --- ÉTAT DU FORMULAIRE ---
    const [language, setLanguage] = useState<'fr' | 'en'>('fr');
    const [packs, setPacks] = useState<[]>([]);
    const [selectedPack, setSelectedPack] = useState([]);
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(defaultDifficulties);
    const [isPrivate, setIsPrivate] = useState(false);
    const [guestNameInput, setGuestNameInput] = useState('');
    const [userName, setUserName] = useState(cookies.get('userName') || guestNameInput || '');
    const [roomName, setRoomName] = useState(`La Room de ${userName}`);
    const [isLoading, setIsLoading] = useState(true);
    const [isPacksLoading, setIsPacksLoading] = useState(true);
    const [showModalMorePacks, setShowModalMorePacks] = useState(false);

    // Règles
    const [maxPlayers, setMaxPlayers] = useState(12);
    const [scoreToWin, setScoreToWin] = useState(100);
    const [timePerRound, setTimePerRound] = useState(20);
    const [estimateTime, setEstimateTime] = useState(0);

    // Options de contenu
    const [enableBlindTest, setEnableBlindTest] = useState(false); // Son activé ?
    const [enableNSFW, setEnableNSFW] = useState(false); // Contenu adulte ?
    const [enableAbbreviations, setEnableAbbreviations] = useState(true); // Raccourcis ?
    const [enableShowWrongAnswers, setEnableShowWrongAnswers] = useState(true); // Afficher les réponses ?

    // Jokers / Items
    const [itemsEnabled, setItemsEnabled] = useState(true);
    const [activeItems, setActiveItems] = useState<{ [key: string]: number }>({
        hint: 1,
        double: 1,
        ink: 1,
        swap: 1
    });
    const [status, setStatus] = useState("LOBBY"); // LOBBY, TIMER_START, FINISHED
    const [backgroundImageUrl, setBackgroundImageUrl] = useState("")
    const [isGameRunning, setIsGameRunning] = useState(false)
    const [tags, setTags] = useState<string[]>([])

    const handleChangesPack = (newPackId: string) => {
        if (selectedPack.includes(newPackId)) {
            setSelectedPack(prev => prev.filter(id => id !== newPackId));
        } else {
            setSelectedPack(prev => [...prev, newPackId]);
        }
    }

    const toggleDifficulty = (difficultyId: string) => {
        setSelectedDifficulties(prev =>
            prev.includes(difficultyId)
                ? prev.filter(id => id !== difficultyId)
                : [...prev, difficultyId]
        );
    }

    console.log("selectedPack", selectedPack);

    useEffect(() => {
        const fetchAllPacks = async () => {
            const result = await roomService.getAllPacks();
            if (result.status === 200) {
                const packsData = await result.data;
                //setSelectedPack(packsData[0].id)
                setPacks(packsData);
                setIsPacksLoading(false);
                console.log("Fetched packs:", packsData);
            } else {
                toast.error('Failed to fetch packs');
            }
        }
        fetchAllPacks()

        if (isEditing || isConsult) {
            console.log("dataRoom?.activeItems", dataRoom?.activeItems);

            setLanguage(dataRoom?.language || 'fr');
            setSelectedPack(dataRoom?.packs || "");
            // Rooms créées avant l'ajout de la difficulté : on retombe sur les 3 niveaux
            setSelectedDifficulties(dataRoom?.difficulties?.length ? dataRoom.difficulties : defaultDifficulties);
            setIsPrivate(dataRoom?.isPrivate || false);
            setRoomName(dataRoom?.name || `La Room de ${dataRoom?.creator}`);
            setMaxPlayers(dataRoom?.maxPlayers || 12);
            setScoreToWin(dataRoom?.scoreToWin || 10000);
            setTimePerRound(dataRoom?.timePerRound || 20);
            setEnableBlindTest(dataRoom?.enableBlindTest || false);
            setEnableNSFW(dataRoom?.enableNSFW || false);
            setEnableAbbreviations(dataRoom?.enableAbbreviations || true);
            setEnableShowWrongAnswers(dataRoom?.enableShowWrongAnswers || true);
            setItemsEnabled(dataRoom?.itemsEnabled || false);
            setActiveItems(dataRoom?.activeItems || { hint: 1, freeze: 1, ink: 0, swap: 0 });
            setStatus(dataRoom?.status || "LOBBY");
            setBackgroundImageUrl(dataRoom?.backgroundImageUrl || "");
            setIsGameRunning(dataRoom?.isGameRunning || false);
            setTags(dataRoom?.tags || [])
        }
        setIsLoading(false);
    }, [isEditing, dataRoom])

    useEffect(() => {
        const estimateGameTime = () => {
            const questionsNeededToWin = scoreToWin / 20
            const timeLooseToDisplayResponse = questionsNeededToWin * 5
            const timeToDisplayQuestion = questionsNeededToWin * timePerRound
            const mergeTime = timeToDisplayQuestion + timeLooseToDisplayResponse
            const formatTimeToMinutes = (mergeTime / 60) * 2

            setEstimateTime(formatTimeToMinutes)
        }
        estimateGameTime()
    }, [scoreToWin, timePerRound]);

    const updateItemUses = (key: string, newValue: number) => {
        if (newValue < 0) return;
        setActiveItems(prev => ({ ...prev, [key]: newValue }));
    };

    const currentPack = packs.find(p => p.id === selectedPack);

    const handleGuestLogin = async () => {
        setIsLoading(true);
        const result = await userService.getUserDataByUsername(guestNameInput);
        if (result.status !== 200) {
            cookies.set('userName', guestNameInput.trim(), { path: '/' });
            setUserName(guestNameInput.trim());
        } else {
            toast.error('Username already exists');
            setUserName("");
        }
        setIsLoading(false);
    };

    const launchRoom = async () => {
        if (selectedPack.length < 1) {
            toast.error('Veuillez choisir au moins pack');
            return false;
        }

        if (selectedDifficulties.length < 1) {
            toast.error('Veuillez choisir au moins un niveau de difficulté');
            return false;
        }

        setIsLoading(true);
        const roomData = {
            idUrl: "",
            language,
            name: roomName,
            packs: selectedPack, // nom du pack
            difficulties: selectedDifficulties, // EASY | MEDIUM | HARD
            isPrivate, // boolean
            creator: userName,
            maxPlayers, // int
            players: [] as Player[], // array
            oldPlayers: [] as Player[], // array
            banPlayers: [] as string[],
            scoreToWin, // int
            timePerRound, // int
            enableBlindTest, // boolean
            enableNSFW,  // boolean
            itemsEnabled, // boolean
            activeItems, // object
            timer: timePerRound,
            enableAbbreviations,
            enableShowWrongAnswers,
            status,
            backgroundImageUrl,
            isGameRunning,
            tags,
            _id: selectedPack,
            createdAt: new Date().toISOString(),
            timerEnd: new Date(Date.now() + timePerRound * 1000),
        };

        if (isEditing) {
            roomData.idUrl = dataRoom?.idUrl || "";
            roomData.players = (dataRoom?.status === "FINISHED" && dataRoom?.players.length === 0) ? [] : (dataRoom?.players || []);
            roomData.oldPlayers = dataRoom?.oldPlayers || [];
            roomData.activeItems = activeItems;
            console.log("Room data:", roomData);
            const result = await roomService.editRoom(roomData)
            if (result.status === 200) {
                const responseData = await result.data;
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
        } else {
            const result = await roomService.launchRoom(roomData)
            console.log("Launch room result:", result);
            if (result.status === 200) {
                toast.success('Room created');
                const roomId = await result.data;
                console.log("Room ID:", roomId);
                redirect(`/${roomId}`);
            } else {
                toast.error('Room not created');
            }
        }
        setIsLoading(false);
    }

    return (
        <>
            {!userName && !isLoading ? (
                <div className="bg-neutral-900 min-h-screen h-[100dvh] md:h-screen flex flex-col md:flex-row md:items-center md:justify-center relative overflow-hidden text-white font-sans">
                    <ModalAskForPseudo guestNameInput={guestNameInput} setGuestNameInput={setGuestNameInput} handleGuestLogin={handleGuestLogin}/>
                </div>
            ) : isLoading ? (
                <div className="flex items-center justify-center h-[100dvh] bg-[#0a0a0f] w-full">
                    <LoadingPage />
                </div>
            ) : (
                <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col">

                    {/* --- HEADER --- */}
                    <CreateRoomHeader setIsEditing={setIsEditing} isEditing={isEditing} setIsConsult={setIsConsult} isConsult={isConsult} />

                    <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                        {/* --- COLONNE GAUCHE (Contenu & Packs) --- */}
                        <div className="lg:col-span-7 space-y-6 md:space-y-8">

                            {/* 1. Nom de la Room */}
                            <RoomNameSection
                                roomName={roomName}
                                setRoomName={setRoomName}
                                language={language}
                                setLanguage={setLanguage}
                                isConsult={isConsult}
                            />

                            {/* 2. Niveaux de difficulté*/}
                            <DifficultySection
                                selectedDifficulties={selectedDifficulties}
                                toggleDifficulty={toggleDifficulty}
                                isConsult={isConsult}
                            />

                            {/* 3. Sélection du Pack */}
                            {isPacksLoading ? (
                                <div className="flex items-center justify-center bg-[#0a0a0f]">
                                    <Loader2Icon className="animate-spin size-10 text-white" />
                                </div>
                            ) : (
                                <PacksSection selectedPack={selectedPack} setSelectedPack={handleChangesPack} isConsult={isConsult} setShowModalMorePacks={setShowModalMorePacks} packs={packs} language={language}/>
                            )}

                            {/* 4. Options de Contenu */}
                            <ContentOptionsSection
                                enableBlindTest={enableBlindTest} setEnableBlindTest={setEnableBlindTest}
                                enableNSFW={enableNSFW} setEnableNSFW={setEnableNSFW}
                                enableAbbreviations={enableAbbreviations} setEnableAbbreviations={setEnableAbbreviations}
                                enableShowWrongAnswers={enableShowWrongAnswers} setEnableShowWrongAnswers={setEnableShowWrongAnswers}
                                isConsult={isConsult}
                            />

                        </div>

                        {/* --- COLONNE DROITE (Règles & Jokers) --- */}
                        <div className="lg:col-span-5 space-y-6 md:space-y-8">

                            {/* 4. Règles du Jeu (Sliders) */}
                            <VictoryConditionsSection
                                scoreToWin={scoreToWin} setScoreToWin={setScoreToWin}
                                timePerRound={timePerRound} setTimePerRound={setTimePerRound}
                                maxPlayers={maxPlayers} setMaxPlayers={setMaxPlayers}
                                isConsult={isConsult}
                            />

                            <JokersSection
                                itemsEnabled={itemsEnabled} setItemsEnabled={setItemsEnabled}
                                activeItems={activeItems} updateItemUses={updateItemUses}
                                isConsult={isConsult}
                            />

                            {/* 6. Confidentialité */}
                            <PrivacySection isPrivate={isPrivate} setIsPrivate={setIsPrivate} isConsult={isConsult} />

                        </div>
                    </main>

                    {/* --- STICKY FOOTER (Action) --- */}
                    <CreateRoomFooter launchRoom={launchRoom} isEditing={isEditing} setIsEditing={setIsEditing} setIsConsult={setIsConsult} isConsult={isConsult} estimateTime={estimateTime}/>

                    <AlertDialog open={showModalMorePacks} onOpenChange={setShowModalMorePacks}>
                        <AlertDialogContent
                            className="bg-neutral-900 border border-white/10 text-white sm:max-w-5xl w-[95vw] max-w-[95vw] h-[88dvh] max-h-[88dvh] p-0 flex flex-col overflow-hidden"
                            onClickOutside={() => setShowModalMorePacks(false)}
                        >
                            <SearchForMorePacks selectedPack={selectedPack} setSelectedPack={handleChangesPack} packs={packs} language={language} onClose={() => setShowModalMorePacks(false)}/>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
            )
            }
        </>
    );
};

export default CreateRoomView;
