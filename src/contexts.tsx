import { createContext } from 'react';

export const GameIdContext = createContext<{
    contextGameID: number | null;
    setContextGameID: (id: number) => void;
} | null>(null);

export const PlayerIdContext = createContext<{
    contextPlayerID: number | null;
    setContextPlayerID: (id: number) => void;
} | null>(null);

export const GameNameContext = createContext<{
    contextGameName: string | null;
    setContextGameName: (name: string) => void;
} | null>(null);
