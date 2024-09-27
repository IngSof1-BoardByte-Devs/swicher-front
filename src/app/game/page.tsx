"use client";

import { EndTurn } from "@/lib/endTurn";
import Gameboard from "@/components/gameboard";
import { LeaveGame } from "@/lib/quit";
import { useState } from "react";
import { Winner } from "@components/winner";
import { Card } from "@components/cards";

const initialJugadores = [
    { jugador_id: 1, nombre_jugador: "pepe" },
    { jugador_id: 2, nombre_jugador: "agus" },
    { jugador_id: 3, nombre_jugador: "juan" },
    { jugador_id: 4, nombre_jugador: "roberto" },
];

const game_id = 1;
const game_name = "test";
const color_bloqueado = "red";

export function Game() {
    const [jugadores, setJugadores] = useState(initialJugadores);
    const [turnoActual, setTurnoActual] = useState<number>(0);

    if (jugadores.length < 2 || jugadores.length > 4) {
        console.error("El número de jugadores debe ser entre 2 y 4");
    }

    if (jugadores.length === 1) {
        return <Winner player_name={jugadores[0].nombre_jugador} />;
    }

    return (
        <div className="w-screen h-screen grid grid-rows-12 grid-cols-12 items-center justify-center gap-4 overflow-hidden p-4">
            {/* Header: Turno Actual, Nombre de Partida y Color Bloqueado */}
            <div className="col-span-12 grid grid-cols-12 items-center">
                <div className="col-start-1 col-span-3">
                    <p className="text-xl">Turno de {jugadores[turnoActual].nombre_jugador}</p>
                </div>
                <div className="col-start-5 col-span-4 text-center">
                    <p className="text-xl">Partida: {game_name}</p>
                </div>
                <div className="col-start-11 col-span-2 text-right flex mr-5 ">
                    <p className="text-xl">Color bloqueado: {color_bloqueado}</p>
                </div>
            </div>

            {/* Jugador 0 */}
            <div className="row-start-11 row-span-2 col-start-5 col-span-4 flex flex-col items-center">
                <p className="text-center">{jugadores[0].nombre_jugador}</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="w-16 h-16">
                        <Card link="c0" />
                    </div>
                    <div className="w-16 h-16">
                        <Card link="c0" />
                    </div>
                    <div className="w-16 h-16">
                        <Card link="c0" />
                    </div>
                </div>
            </div>

            {/* Jugador 1*/}
            <div className="row-start-2 row-span-2 col-start-5 col-span-4 flex flex-col items-center">
                <p className="text-center">{jugadores[1].nombre_jugador}</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="w-16 h-16">
                        <Card link="c0" />
                    </div>
                    <div className="w-16 h-16">
                        <Card link="c0" />
                    </div>
                    <div className="w-16 h-16">
                        <Card link="c0" />
                    </div>
                </div>
            </div>

            {/* Jugador 2 */}
            <div className="row-start-5 row-span-2 col-start-1 col-span-3 flex flex-col items-center">
                <p className="text-center">{jugadores[2].nombre_jugador}</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="w-16 h-16">
                        <Card link="c0" />
                    </div>
                    <div className="w-16 h-16">
                        <Card link="c0" />
                    </div>
                    <div className="w-16 h-16">
                        <Card link="c0" />
                    </div>
                </div>
            </div>

            {/* Jugador 3 */}
            <div className="row-start-5 row-span-2 col-start-10 col-span-3 flex flex-col items-center">
                <p className="text-center">{jugadores[3].nombre_jugador}</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="w-16 h-16">
                        <Card link="c0" />
                    </div>
                    <div className="w-16 h-16">
                        <Card link="c0" />
                    </div>
                    <div className="w-16 h-16">
                        <Card link="c0" />
                    </div>
                </div>
            </div>

            {/* Tablero de juego */}
            <div className="row-start-4 row-span-6 col-start-4 col-span-6 flex items-center justify-center">
                <Gameboard />
            </div>

            {/* Botones de acción */}
            <div className="row-start-12 col-start-9 col-end-11 flex justify-end">
                <button
                    onClick={() => {
                        EndTurn(jugadores[turnoActual].jugador_id);
                        setTurnoActual(turnoActual === jugadores.length - 1 ? 0 : turnoActual + 1);
                    }}
                    className="border-2 text-white p-2 rounded bg-gray-900 hover:bg-gray-700 transition w-full"
                >
                    Pasar turno
                </button>
            </div>
            <div className="row-start-12 col-start-11 col-end-13 flex justify-end">
                <button
                    onClick={() => {
                        LeaveGame({ player_id: jugadores[turnoActual].jugador_id, game_id });
                        setJugadores(jugadores.filter((_, index) => index !== turnoActual));
                        setTurnoActual(turnoActual === jugadores.length - 1 ? turnoActual - 1 : turnoActual);
                    }}
                    className="border-2 text-white p-2 rounded bg-gray-900 hover:bg-gray-700 transition w-full"
                >
                    Abandonar partida
                </button>
            </div>
        </div>
    );
}

export default Game;
