'use client';

import clsx from 'clsx';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

// components
import { Winner } from '@/components/winner';
import { Gameboard } from '@/components/gameboard';
// types
import { Player_with_turn } from '@/types/player';
import { GameNameContext } from '@/contexts';
import ModalComponent from '@/components/modal';

export function Game() {
    const router = useRouter();
    const [players, setPlayers] = useState<Player_with_turn[]>([]);

    const gameName = useContext(GameNameContext);
    return (
        <div className="w-full h-dvh">
            {players.length === 1 && (
                <div className="z-50">
                    <ModalComponent>
                        <Winner player_name="Player 1" />
                    </ModalComponent>
                </div>
            )}
            {/* Header: Turno Actual, Nombre de Partida y Color Bloqueado */}
            <header className="flex flex-col">
                <p className="text-2xl font-bold text-center p-2">
                    {gameName?.contextGameName}
                </p>
            </header>
            <div className="flex flex-col">
                {/* Tablero de juego */}
                <div className="p-1 w-full lg:w-1/3">
                    <Gameboard />
                </div>
            </div>
        </div>
    );
}

export default Game;
