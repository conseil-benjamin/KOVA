import React, { use } from "react";
import GameView from "@/components/game/GameView";

export default function Game({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params);

    return <GameView roomId={roomId} />;
}