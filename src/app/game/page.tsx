"use client";

import { useEffect, useState } from "react";
import { Gameboard } from "@/components/gameboard";
import { Card } from "@components/cards";
import { end_turn } from "@/lib/board";
import { fetch_game, leave_game } from "@/lib/game";
import { Winner } from "@/components/winner";
import { useWebSocket } from "@app/contexts/WebSocketContext";
import { useGameInfo } from '@app/contexts/GameInfoContext';
import clsx from "clsx";

export function Game() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [gameName, setGameName] = useState("");
    const [color, setColor] = useState(-1);
    const [actualTurn, setActualTurn] = useState(-1);
    const { socket } = useWebSocket();
    const { id_game, id_player } = useGameInfo();

    interface Player {
        id: number;
        username: string;
        turn: number;
    }

    useEffect(() => {
        const fetchGame = async () => {
            try {
                if (id_game == null) return;
                const data = await fetch_game({ game_id: id_game });
                setPlayers(data.players);
                setGameName(data.name);
                setColor(data.bloqued_color);
                setActualTurn(data.turn);
            } catch (err) {
                console.error("Failed to fetch players:", err);
            }
        };
        fetchGame();
    }, [id_game, color]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const socketData = JSON.parse(event.data);
                if (socketData.event === "change_turn") {
                    setActualTurn(socketData.data.turn);
                } else if (socketData.event === "player_left") {
                    setPlayers(players.filter(player => player.id !== socketData.data.player_id));
                }

            };
        }
    }, [socket, players]);

    return (
        <div className="w-screen h-screen grid grid-rows-10 grid-cols-12 md:grid-rows-12 items-center justify-center overflow-hidden p-4">
            {players.length === 1 &&
                <div className="z-50">
                    <Winner player_name={players[0].username} />
                </div>
            }
            {/* Header: Turno Actual, Nombre de Partida y Color Bloqueado */}
            <div className="col-span-12 place-content-center text-center h-full grid grid-cols-2">
                <div>
                    <p className="text-2xl font-bold">Partida: {gameName}</p>
                </div>
                <div>
                    <p className="text-2xl font-bold">Blocked: {clsx({
                        "red ": color === 0,
                        "green": color === 1,
                        "blue": color === 2,
                        "violet": color === 3,
                        "None": color === null,
                    })}</p>
                </div>
            </div>
            {/* Tablero de juego */}
            <div className="h-full row-span-4 col-span-12 p-1 md:row-span-6 md:col-span-6 md:row-start-4 md:col-start-4">
                {id_game !== null && <Gameboard id_game={id_game} />}
            </div>{players.map(({ id, username, turn }, index) => {
                return (
                    <div key={username + index} className="col-span-12 w-full h-full p-1">
                        <div className="grid grid-cols-7 w-full h-full items-center justify-center overflow-hidden">
                            <div className="flex justify-center">
                                <p className={clsx("font-bold w-fit p-1",
                                    {
                                        "bg-black text-white rounded dark:bg-white dark:text-black": actualTurn === turn,
                                    })}>{username}</p>
                            </div>
                            <div className="col-span-6 grid grid-cols-6 w-full h-full">
                                <div key={username + index} className={clsx(
                                    "col-span-12 w-full h-full p-1",
                                    {
                                        "md:col-start-4 md:row-span-2  md:col-span-6": index === 0,
                                        "md:row-start-5 md:row-span-3  md:col-span-3": index === 1,
                                        "md:row-start-5 md:col-start-10 md:row-span-3  md:col-span-3": index === 2,
                                        "md:row-start-10 md:col-start-4 md:row-span-2  md:col-span-6": index === 3,
                                    }
                                )}>
                                    <div className={clsx(
                                        "grid grid-cols-7 w-full h-full items-center justify-center",
                                        {
                                            "md:grid-cols-6 md:grid-rows-2": index === 0 || index === 3,
                                            "md:grid-cols-3 md:grid-rows-3": index === 1 || index === 2,
                                        }

                                    )}>
                                        <div className="md:col-span-6 md:flex md:justify-center md:text-xl text-center block font-bold">{username}</div>
                                        <div className={clsx(
                                            "col-span-6 grid grid-cols-6 w-full h-full gap-1",
                                            {
                                                "md:grid-rows-1 md:grid-cols-6 md:gap-1": index === 0 || index === 3,
                                                "md:row-span-2 md:grid-cols-3 md:gap-1": index === 1 || index === 2,
                                            }

                                        )}>
                                            {Array(3).fill(null).map((_, index) => (
                                                <button key={index} className="w-full h-full">
                                                    <Card link="c0" />
                                                </button>
                                            ))}
                                            {Array(3).fill(null).map((_, index) => (
                                                <button key={index} className="w-full h-full">
                                                    <Card link="c1" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            {/* botones */}
            <div className="md:row-start-12 col-span-12 grid grid-cols-2  md:flex md:justify-between h-full p-2 gap-2">
                <button
                    onClick={() => {
                        if (id_player !== null) {
                            end_turn(id_player);
                        }
                    }}
                    className="md:justify-start p-1 border-2 text-white rounded bg-slate-700 hover:hover:bg-gray-700/95 dark:rounded-none dark:bg-inherit dark:hover:bg-gray-600">terminar turno</button>
                <button
                    onClick={() => {
                        if (id_player !== null) {
                            leave_game({ player_id: id_player }).then(() => {
                            });
                        }
                    }}
                    className="md:justify-end p-1 border-2 text-white rounded bg-slate-700 hover:hover:bg-gray-700/95 dark:rounded-none dark:bg-inherit dark:hover:bg-gray-600">abandonar partida</button>
            </div>
        </div>
    );
}


                            export default Game;