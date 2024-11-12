import { use, useEffect, useState } from "react";

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

interface CountDownProps {
    startTime: number | null;
    duration: number;
    onEnd: () => void;
}

function CountDown({ startTime, duration, onEnd }: CountDownProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (startTime === null) return;

        const updateTimer = () => {
            const currentTime = Date.now() / 1000; // tiempo en segundos
            const elapsed = currentTime - startTime;
            const remaining = Math.max(duration - elapsed, 0);
            setTimeLeft(remaining);

            if (remaining <= 0) {
                onEnd();
            }
        };

        const intervalId = setInterval(updateTimer, 500); // actualiza cada 0.5 segundos para precisión

        return () => clearInterval(intervalId);
    }, [startTime, duration, onEnd]);

    return (
        <div className="font-bold text-3xl">{formatTime(Math.floor(timeLeft))}</div>
    );
}

export default CountDown;