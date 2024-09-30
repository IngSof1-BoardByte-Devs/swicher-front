"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface GameInfoContextType {
    id_game: number | null;
    id_player: number | null;
    setIdGame: (id: number | null) => void;
    setIdPlayer: (id: number | null) => void;
}

const GameInfoContext = createContext<GameInfoContextType | undefined>(undefined);

export const GameInfoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [id_game, setIdGameState] = useState<number | null>(null);
    const [id_player, setIdPlayerState] = useState<number | null>(null);

    useEffect(() => {
        const storedIdGame = localStorage.getItem('id_game');
        const storedIdPlayer = localStorage.getItem('id_player');
        if (storedIdGame) setIdGameState(Number(storedIdGame));
        if (storedIdPlayer) setIdPlayerState(Number(storedIdPlayer));
    }, []);

    const setIdGame = (id: number | null) => {
        setIdGameState(id);
        if (id) {
            localStorage.setItem('id_game', id.toString());
        } else {
            localStorage.removeItem('id_game');
        }
    };

    const setIdPlayer = (id: number | null) => {
        setIdPlayerState(id);
        if (id) {
            localStorage.setItem('id_player', id.toString());
        } else {
            localStorage.removeItem('id_player');
        }
    };

    return (
        <GameInfoContext.Provider value={{ id_game, id_player, setIdGame, setIdPlayer }}>
            {children}
        </GameInfoContext.Provider>
    );
};

export const useGameInfo = (): GameInfoContextType => {
    const context = useContext(GameInfoContext);
    if (context === undefined) {
        throw new Error('useGameInfo must be used within a GameInfoProvider');
    }
    return context;
};