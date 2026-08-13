import React from 'react';
import CreateRoomView from '@/components/createRoom/CreateRoomView';

export const metadata = {
    title: 'Créer une partie - KOVA',
    description: 'Configurez votre salle de jeu KOVA',
};

const CreateRoomPage = () => {
    // @ts-ignore
    return <CreateRoomView />;
};

export default CreateRoomPage;