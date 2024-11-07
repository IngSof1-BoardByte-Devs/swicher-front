'use client';
import './globals.css';
import { useEffect, useRef, useState } from 'react';
import LoadingComponent from './loading';
import { GameIdContext, GameNameContext, PlayerIdContext } from '@/contexts';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [loading, setLoading] = useState(true);
    // game global data
    const [contextGameID, setContextGameID] = useState<number | null>(null);
    let contextGameName = useRef<string | null>('Partida sample');
    // game setters
    function setContextGameName(name: string) {
        contextGameName.current = name;
        console.log('Game Name:', contextGameName.current);
    }

    // player global data
    let contextPlayerID = useRef<number | null>(null);
    function setContextPlayerID(id: number) {
        contextPlayerID.current = id;
        console.log('Player ID:', contextPlayerID.current);
    }

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <html lang="en">
                <body>
                    <LoadingComponent />
                </body>
            </html>
        );
    }

    return (
        <html lang="en">
            <body>
                <GameIdContext.Provider
                    value={{ contextGameID: contextGameID, setContextGameID }}
                >
                    <GameNameContext.Provider
                        value={{
                            contextGameName: contextGameName.current,
                            setContextGameName,
                        }}
                    >
                        <PlayerIdContext.Provider
                            value={{
                                contextPlayerID: contextPlayerID.current,
                                setContextPlayerID,
                            }}
                        >
                            {children}
                        </PlayerIdContext.Provider>
                    </GameNameContext.Provider>
                </GameIdContext.Provider>
            </body>
        </html>
    );
}
