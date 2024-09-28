"use client";

import { EndTurn } from "@/lib/endTurn";
import Gameboard from "@/components/gameboard";
import { LeaveGame } from "@/lib/quit";
import { useState } from "react";
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
    };

    const countRestantes = jugadores.filter((jugador) => !jugador.abandonado).length;

    if (countRestantes === 1) {
        const remainingPlayer = jugadores.find((jugador) => !jugador.abandonado);
        return <Winner player_name={remainingPlayer?.nombre_jugador || "Unknown Player"} />;
    }

    return (
        <div className="w-screen h-screen grid grid-rows-12 grid-cols-12 items-center justify-center gap-4 overflow-hidden p-4">
            {/* Header: Turno Actual, Nombre de Partida y Color Bloqueado */}
            <div className="col-span-12 grid grid-cols-12 items-center">
                <div className="col-start-1 col-span-3">
                    <p className="text-2xl font-bold">Turno de {jugadores[turnoActual]?.nombre_jugador || "Jugador ausente"}</p>
                </div>
                <div className="col-start-5 col-span-3 text-center">
                    <p className="text-2xl font-bold">Partida: {game_name}</p>
                </div>
                <div className="col-end-13 col-span-3 text-right flex mr-5 ">
                    <p className="text-2xl font-bold">Blocked: {color_bloqueado}</p>
                </div>
            </div>

            {/* Jugador 0 */}
            <div className="row-start-11 row-span-2 col-start-5 col-span-4 flex flex-col items-center">
                {jugadores[0]?.abandonado ? (
                    <p className="text-center block font-bold text-red-500">Jugador abandonó</p>
                ) : (
                    <>
                        <p className="text-center block font-bold">{jugadores[0].nombre_jugador}</p>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                            {Array(3).fill(null).map((_, index) => (
                                <button key={index} className="w-16 h-16">
                                    <Card link="c0" />
                                </button>
                            ))}
                            {Array(3).fill(null).map((_, index) => (
                                <button key={index} className=" ml-3 w-16 h-16">
                                    <Card link="c1" />
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Jugador 1 */}
            <div className="row-start-2 row-span-2 row-end-3 col-start-5 col-span-4 flex flex-col items-center">
                {jugadores[1]?.abandonado ? (
                    <p className="text-center block font-bold text-red-500">Jugador abandonó</p>
                ) : (
                    <>
                        <p className="text-center block font-bold">{jugadores[1].nombre_jugador}</p>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                            {Array(3).fill(null).map((_, index) => (
                                <button key={index} className="w-16 h-16">
                                    <Card link="c0" />
                                </button>
                            ))}
                            {Array(3).fill(null).map((_, index) => (
                                <button key={index} className=" ml-3 w-16 h-16">
                                    <Card link="c1" />
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Jugador 2 */}
            {jugadores.length >= 3 && (
                <div className="row-start-5 row-span-2 col-start-1 col-span-3 flex flex-col items-center">
                    {jugadores[2]?.abandonado ? (
                        <p className="text-center block font-bold text-red-500">Jugador abandonó</p>
                    ) : (
                        <>
                            <p className="text-center block font-bold">{jugadores[2].nombre_jugador}</p>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {Array(3).fill(null).map((_, index) => (
                                    <button key={index} className="w-16 h-16">
                                        <Card link="c0" />
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {Array(3).fill(null).map((_, index) => (
                                    <button key={index} className="w-16 h-16">
                                        <Card link="c1" />
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Jugador 3 */}
            {jugadores.length === 4 && (
                <div className="row-start-5 row-span-2 col-start-10 col-span-3 flex flex-col items-center">
                    {jugadores[3]?.abandonado ? (
                        <p className="text-center block font-bold text-red-500">Jugador abandonó</p>
                    ) : (
                        <>
                            <p className="text-center block font-bold">{jugadores[3].nombre_jugador}</p>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {Array(3).fill(null).map((_, index) => (
                                    <button key={index} className="w-16 h-16">
                                        <Card link="c0" />
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {Array(3).fill(null).map((_, index) => (
                                    <button key={index} className="w-16 h-16">
                                        <Card link="c1" />
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Tablero de juego */}
            <div className="row-start-4 row-span-6 col-start-4 col-span-6 flex items-center justify-center">
                <Gameboard />
            </div>

            {/* Botones de acción */}
            <div className="row-start-12 col-start-1 col-end-3 flex justify-start">
                <button
                    onClick={() => {
                        EndTurn(jugadores[turnoActual].jugador_id);
                        avanzarTurno(); 
                    }}
                    className="border-2 text-white p-2 rounded bg-slate-700 hover:hover:bg-gray-700/95 transition w-full"
                >
                    Pasar turno
                </button>
            </div>
            <div className="row-start-12 col-start-11 col-end-13 flex justify-end">
                <button
                    onClick={() => {
                        LeaveGame({ player_id: jugadores[turnoActual].jugador_id, game_id });
                        handleAbandonar(turnoActual);
                        avanzarTurno(); 
                    }}
                    className="border-2 text-white p-2 rounded bg-slate-700 hover:hover:bg-gray-700/95 transition w-full"
                >
                    Abandonar partida
                </button>
            </div>
        </div>
    );
}

export default Game;
