"use client";

import { EndTurn } from "@/lib/endTurn";
import Gameboard from "@/components/gameboard";
import { LeaveGame } from "@/lib/quit";
import { useEffect, useState } from "react";
import { Winner } from "@components/winner";
import { Card } from "@components/cards";

const initialJugadores = [
    { jugador_id: 1, nombre_jugador: "pepe", abandonado: false },
    { jugador_id: 2, nombre_jugador: "agus", abandonado: false },
    { jugador_id: 3, nombre_jugador: "juan", abandonado: false },
    { jugador_id: 4, nombre_jugador: "roberto", abandonado: false },
];

const game_id = 1;
const game_name = "test";
const color_bloqueado = "red";

export function Game() {
    const [jugadores, setJugadores] = useState(initialJugadores);
    const [turnoActual, setTurnoActual] = useState<number>(0);


    const handleAbandonar = (index: number) => {
        const jugadoresActualizados = [...jugadores];
        jugadoresActualizados[index].abandonado = true;
        setJugadores(jugadoresActualizados);
    };

    const avanzarTurno = () => {
        let nuevoTurno = turnoActual;
        let encontrado = false;
        while (!encontrado) {
            nuevoTurno = (nuevoTurno + 1) % jugadores.length;
            if (!jugadores[nuevoTurno].abandonado) {
                encontrado = true;
            }
        }
        setTurnoActual(nuevoTurno);
        console.log(turnoActual)
    };

    const countRestantes = jugadores.filter((jugador) => !jugador.abandonado).length;

    if (countRestantes === 1) {
        const remainingPlayer = jugadores.find((jugador) => !jugador.abandonado);
        return <Winner player_name={remainingPlayer?.nombre_jugador || "Unknown Player"} />;
    }

    return (
        <div className="w-screen h-screen grid grid-rows-10 grid-cols-12 md:grid-rows-12 items-center justify-center overflow-hidden p-4">
            {/* Header: Turno Actual, Nombre de Partida y Color Bloqueado */}
            <div className="col-span-12 place-content-center text-center h-full grid grid-cols-2">
                <div>
                    <p className="text-2xl font-bold">Partida: {game_name}</p>
                </div>
                <div>
                    <p className="text-2xl font-bold">Blocked: {color_bloqueado}</p>
                </div>
            </div>
            {/* Tablero de juego */}
            <div className="h-full row-span-4 col-span-12 p-1 md:row-span-6 md:col-span-6 md:row-start-4 md:col-start-4">
                <Gameboard />
            </div>
            {/* Jugador 0 */}
            
            <div  className="md:row-start-2 md:col-start-4 md:row-span-2  md:col-span-6  col-span-12 w-full h-full p-1">
                    {(jugadores[0].abandonado) ? (
                        <p className="text-center block font-bold text-red-500">Jugador abandono</p>
                    ) : (
                        <div className="md:grid-cols-6 md:grid-rows-2 grid grid-cols-7   w-full h-full items-center justify-center">
                            <div className="md:col-span-6 md:flex md:justify-center md:text-xl text-center block font-bold">{jugadores[0].nombre_jugador}</div>
                            <div className="md:grid-rows-1 md:grid-cols-6 md:gap-1 col-span-6 grid grid-cols-6 w-full h-full">
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
                    )}
                </div>

            {/* Jugador 1 */}

            <div  className="md:row-start-5 md:row-span-3  md:col-span-3  col-span-12 w-full h-full p-1">
                    {(jugadores[1].abandonado) ? (
                        <p className="text-center block font-bold text-red-500">Jugador abandono</p>
                    ) : (
                        <div className="md:grid-cols-3 md:grid-rows-3 grid grid-cols-7   w-full h-full items-center justify-center">
                            <div className="md:col-span-6 md:flex md:justify-center md:text-xl text-center block font-bold">{jugadores[1].nombre_jugador}</div>
                            <div className="md:row-span-2 md:grid-cols-3 md:gap-1 col-span-6 grid grid-cols-6 w-full h-full">
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
                    )}
                </div>

            {/* Jugador 2 */}

            <div  className="md:row-start-5 md:col-start-10 md:row-span-3  md:col-span-3  col-span-12 w-full h-full p-1">
                    {(jugadores[2].abandonado) ? (
                        <p className="text-center block font-bold text-red-500">Jugador abandono</p>
                    ) : (
                        <div className="md:grid-cols-3 md:grid-rows-3 grid grid-cols-7   w-full h-full items-center justify-center">
                            <div className="md:col-span-6 md:flex md:justify-center md:text-xl text-center block font-bold">{jugadores[2].nombre_jugador}</div>
                            <div className="md:row-span-2 md:grid-cols-3 md:gap-1 col-span-6 grid grid-cols-6 w-full h-full">
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
                    )}
                </div>

            {/* Jugador 3 */}

            <div  className="md:row-start-10 md:col-start-4 md:row-span-2  md:col-span-6  col-span-12 w-full h-full p-1">
                    {(jugadores[3].abandonado) ? (
                        <p className="text-center block font-bold text-red-500">Jugador abandono</p>
                    ) : (
                        <div className="md:grid-cols-6 md:grid-rows-2 grid grid-cols-7   w-full h-full items-center justify-center">
                            <div className="md:col-span-6 md:flex md:justify-center md:text-xl text-center block font-bold">{jugadores[3].nombre_jugador}</div>
                            <div className="md:grid-rows-1 md:grid-cols-6 md:gap-1 col-span-6 grid grid-cols-6 w-full h-full">
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
                    )}
                </div>

            {/* botones */}
            <div className="md:row-start-12 col-span-12 grid grid-cols-2  md:flex md:justify-between h-full p-2 gap-2">
                <button
                onClick={() => {
                    EndTurn(jugadores[turnoActual].jugador_id);
                    avanzarTurno(); 
                }}
                 className="md:justify-start p-1 border-2 text-white rounded bg-slate-700 hover:hover:bg-gray-700/95">terminar turno</button>

                <button
                onClick={() => {
                    LeaveGame({ player_id: jugadores[turnoActual].jugador_id, game_id });
                    handleAbandonar(turnoActual);
                    avanzarTurno(); 
                }}
                 className="md:justify-end p-1 border-2 text-white rounded bg-slate-700 hover:hover:bg-gray-700/95">abandonar partida</button>
            </div>
        </div>
    );
}

export default Game;