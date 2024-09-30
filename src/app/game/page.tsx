"use client";

import Gameboard from "@/components/gameboard";
import { useEffect, useState } from "react";
import { Card } from "@components/cards";
import { useCookies } from "react-cookie";
import { fetch_game, leave_game } from "@/lib/game";
import { end_turn } from "@/lib/board";
import clsx from "clsx";
import { Winner } from "@/components/winner";
import { useWebSocket } from "../contexts/WebSocketContext";

export function Game() {
    const [cookie, setCookie] = useCookies(["player_id", "game_id", "game_name"]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [gameName, setGameName] = useState("");
    const [color, setColor] = useState(-1);
    const [actualTurn, setActualTurn] = useState(-1);
    const { socket } = useWebSocket();

    interface Player {
        id: number;
        username: string;
        turn: number;
    }

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const data = await fetch_game({ game_id: cookie.game_id });
                setPlayers(data.players);
                setGameName(data.name);
                setColor(data.bloqued_color);
                setActualTurn(data.turn);
            } catch (err) {
                console.error("Failed to fetch players:", err);
            }
        };
        fetchGame();
    }, [cookie.game_id, color]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const socketData = JSON.parse(event.data);
                console.log(socketData);
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
                <Gameboard id_game={cookie.game_id} />
            </div>{players.map(({ id, username, turn }, index) => {
                return (
                    <div key={username + index} className="col-span-12 w-full h-full p-1">
                        <div className="grid grid-cols-7 w-full h-full items-center justify-center overflow-hidden">
                            <div className="flex justify-center">
                                <p className={clsx("font-bold w-fit p-1",
                                    {
                                        "bg-black text-white rounded": actualTurn === turn,
                                    })}>{username}</p>
                            </div>
                            <div className="col-span-6 grid grid-cols-6 w-full h-full">
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
                );
            })}
            {/* botones */}
            <div className="md:row-start-12 col-span-12 grid grid-cols-2  md:flex md:justify-between h-full p-2 gap-2">
                <button
                    onClick={() => {
                        end_turn(cookie.player_id);
                    }}
                    className="md:justify-start p-1 border-2 text-white rounded bg-slate-700 hover:hover:bg-gray-700/95">terminar turno</button>

                <button
                    onClick={() => {
                        leave_game({ player_id: cookie.player_id });
                    }}
                    className="md:justify-end p-1 border-2 text-white rounded bg-slate-700 hover:hover:bg-gray-700/95">abandonar partida</button>
            </div>
        </div>
    );
}

export default Game;