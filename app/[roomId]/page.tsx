import React, { use } from "react";
import GameView from "@/components/game/GameView";

export default async function Game({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await params;

    if (!roomId) {
        return <div>Room not found</div>;
    }

    return <GameView roomId={roomId} />;
}