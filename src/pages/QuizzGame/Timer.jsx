import React, { useState, useEffect } from 'react';

const Timer = ({ timeQuestionBegin, baseTime, setRemainingTime, remainingTime }) => {

    useEffect(() => {
        const startTime = new Date(timeQuestionBegin).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const elapsedTime = Math.floor((now - startTime) / 1000);
            const timeLeft = baseTime - elapsedTime;

            setRemainingTime(timeLeft > 0 ? timeLeft : 0);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeQuestionBegin]);

    return (
        <div>
            <h1>{remainingTime}s restantes</h1>
        </div>
    );
};

export default Timer;
