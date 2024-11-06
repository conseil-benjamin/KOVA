import React, { useEffect, useRef } from 'react';

const Timer = ({ timeQuestionBegin, baseTime, setRemainingTime, remainingTime }) => {
    const intervalRef = useRef(null); // Ref pour stocker l'interval
    const startTimeRef = useRef(new Date(timeQuestionBegin).getTime()); // Ref pour stocker le temps de début

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const elapsedTime = Math.floor((now - startTimeRef.current) / 1000);
            const timeLeft = baseTime - elapsedTime;

            setRemainingTime(timeLeft > 0 ? timeLeft : 0);
        };

        // Démarrer l'interval
        intervalRef.current = setInterval(updateTimer, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current); // Nettoyage de l'interval quand le composant est démonté
            }
        };
    }, [baseTime, setRemainingTime]);

    return (
        <div>
            <h1>{remainingTime}s restantes</h1>
        </div>
    );
};

export default Timer;
