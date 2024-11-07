'use client';
import { use, useContext, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// context
import { GameIdContext } from '@/contexts';

// components
import { GameList } from '@/components/list';
import { CreateGameForm, UserForm } from '@/components/form';
import { ModalComponent } from '@/components/modal';

export default function Home() {
    const [createGame, setCreateGame] = useState(false);
    const [joinGame, setJoinGame] = useState(false);
    const contextGameID = useContext(GameIdContext);
    const controls = useAnimation();

    if (!contextGameID) {
        throw new Error('GameIdContext is not provided');
    }

    useEffect(() => {
        controls.start({
            color: ['#00FF00', '#FF0000', '#800080', '#00FFFF'],
            transition: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
        });
    }, [controls]);

    const devs = [
        'Ramiro cuellar',
        'Juan Quintero',
        'Juan Mazzaforte',
        'Daniela Courel',
        'Aaron Lihuel',
        'Franco Bustos',
    ];

    return (
        <div className="w-full h-dvh overflow-auto">
            {/* Title */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
                <main className="flex items-center justify-center w-full h-full p-7 flex-col">
                    <h1 className="text-4xl text-center uppercase font-semibold">
                        boardbyte devs{' '}
                        <motion.span animate={controls}>SWITCHER</motion.span>
                    </h1>
                    <ul className="flex gap-5 text-xs">
                        {devs.map((dev, index) => {
                            return (
                                <li key={index} className="text-center">
                                    {dev}
                                </li>
                            );
                        })}
                    </ul>
                </main>
            </motion.div>
            <div className="p-4 flex flex-col gap-3">
                {/* List titles */}
                <div className="flex justify-between">
                    <p>{'Nombre de partidas'}</p>
                    <p>{'Cantidad de jugadores'}</p>
                </div>
                {/* Game List */}
                <GameList />
            </div>
            {/* buttons */}
            <div className="p-4">
                <div className="flex gap-1 justify-center">
                    <button
                        className="border dark:rounded-none shadow rounded p-2 dark:bg-inherit dark:hover:bg-gray-600 bg-slate-700 hover:hover:bg-gray-700/95 text-white capitalize"
                        onClick={() => setCreateGame(true)}
                    >
                        Crear partida
                    </button>
                    <button
                        className="border dark:rounded-none shadow rounded p-2 dark:bg-inherit dark:hover:bg-gray-600 bg-slate-700 hover:hover:bg-gray-700/95 text-white capitalize disabled:hover:dark:bg-inherit disabled:opacity-50"
                        disabled={contextGameID.contextGameID === null}
                        onClick={() => setJoinGame(true)}
                    >
                        unirse partida
                    </button>
                </div>
            </div>
            {/* create game form */}
            {createGame && (
                <ModalComponent>
                    <CreateGameForm />
                    <button
                        className="absolute top-0 right-0 w-7 h-7"
                        onClick={() => setCreateGame(false)}
                    >
                        x
                    </button>
                </ModalComponent>
            )}
            {/* join game form */}
            {joinGame && (
                <ModalComponent>
                    <UserForm />
                    <button
                        className="absolute top-0 right-0 w-7 h-7"
                        onClick={() => setJoinGame(false)}
                    >
                        x
                    </button>
                </ModalComponent>
            )}
        </div>
    );
}
