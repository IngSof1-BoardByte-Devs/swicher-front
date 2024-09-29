"use client";

import Gameboard from "@/components/gameboard";
import { useEffect, useState } from "react";
import { Card } from "@components/cards";
import { useCookies } from "react-cookie";
import { fetch_game, leave_game } from "@/lib/game";
import { end_turn } from "@/lib/board";
import { useRouter } from "next/navigation";


export function Game() {
    const router = useRouter();
    const [cookie, setCookie] = useCookies(["player_id", "game_id", "game_name"]);
    const [players, setPlayers] = useState([]);
    const [winner, setWinner] = useState(false);
    const [gameName, setGameName] = useState("");

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const data = await fetch_game({ game_id: cookie.game_id });
                setPlayers(data.players);
                setGameName(data.name);
            } catch (err) {
                console.error("Failed to fetch players:", err);
            }
        };

        fetchGame();

    }, [cookie.game_id]);

    return (
        <div className="w-screen h-screen grid grid-rows-10 grid-cols-12 md:grid-rows-12 items-center justify-center overflow-hidden p-4">
            {/* Header: Turno Actual, Nombre de Partida y Color Bloqueado */}
            <div className="col-span-12 place-content-center text-center h-full grid grid-cols-2">
                <div>
                    <p className="text-2xl font-bold">Partida: {gameName}</p>
                </div>
                <div>
                    <p className="text-2xl font-bold">Blocked: {" ni idea "}</p>
                </div>
            </div>
            {/* Tablero de juego */}
            <div className="h-full row-span-4 col-span-12 p-1 md:row-span-6 md:col-span-6 md:row-start-4 md:col-start-4">
                <Gameboard player_id={cookie.player_id} />
            </div>{players.map(({ username }, index) => {
                return (
                    <div key={username + index} className="col-span-12 w-full h-full p-1">
                        <div className="grid grid-cols-7 w-full h-full items-center justify-center">
                            <p className="text-center block font-bold">{username}</p>
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
                        leave_game({ player_id: cookie.player_id, game_id: cookie.game_id });
                    }}
                    className="md:justify-end p-1 border-2 text-white rounded bg-slate-700 hover:hover:bg-gray-700/95">abandonar partida</button>
            </div>
        </div>
    );
}

export default Game;