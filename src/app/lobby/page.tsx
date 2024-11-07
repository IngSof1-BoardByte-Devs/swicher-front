'use client';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

// types
import { Player } from '@/types/player';

// components
import { Button } from '@/components/buttons';
import { PlayerList } from '@/components/list';

// context
import { GameNameContext } from '@/contexts';

export default function LobbyPage() {
    const [error, setError] = useState<string>('');
    const [players, setPlayers] = useState<Player[]>([]);

    const gameName = useContext(GameNameContext);

    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-between min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div className="text-center">
                <h1 className="text-4xl font-bold uppercase">
                    {gameName?.contextGameName}
                </h1>
                <h1 className="text-lg font-bold uppercase">{'LOBBY'}</h1>
            </div>
            <PlayerList />
            <div className="flex flex-col gap-2 justify-center mt-12">
                {error && (
                    <p className="text-red-500 max-w-full text-sm text-center mt-2">
                        {error}
                    </p>
                )}
                {2 === players[0]?.player_id && (
                    <Button text="Comenzar partida" fun={() => {}} />
                )}
                <Button text="Abandonar partida" fun={() => {}} />
            </div>
        </div>
    );
}
