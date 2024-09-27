"use client";
import { EndTurn } from "@/lib/endTurn";
import Gameboard from "./gameboard";
import { LeaveGame } from "@/lib/quit";
import { useState } from "react";
import { Winner } from "./winner";
import { Card } from "./cards";

interface InGameProps {
    jugador_id: number;
    nombre_jugador: string;
}
interface InGameComponentProps {
    jugadores: InGameProps[];
    game_id: number;
}

export function InGame({ jugadores: initialJugadores, game_id }: InGameComponentProps) {
    const [jugadores, setJugadores] = useState(initialJugadores);
    const [turnoActual, setTurnoActual] = useState<number>(0);
    if (jugadores.length < 2 || jugadores.length > 4) {
        console.error("El número de jugadores debe ser entre 2 y 4");
    }

    const positions = [
        'top-0 left-1/2 transform -translate-x-1/2 m-5',    // Medio arriba
        'bottom-0 left-1/2 transform -translate-x-1/2 m-5', // Medio abajo
        'left-0 top-1/2 transform -translate-y-1/2 m-5',    // Medio izquierda
        'right-0 top-1/2 transform -translate-y-1/2 m-5'    // Medio derecha
    ];

    if (jugadores.length === 1) {
        return <Winner player_name={jugadores[0].nombre_jugador} />;
    }


    return (
        <div className="w-full h-dvh flex items-center justify-center relative">
            <div>
                <p className="text-xl absolute left-0 top-0 m-5">Turno de {jugadores[turnoActual].nombre_jugador}</p>
            </div>
            {jugadores.map((jugador, index) => (
                <div key={jugador.jugador_id} className={`absolute text-center ${positions[index]}`}>
                <p>{jugador.nombre_jugador}</p>
                <div className="flex justify-center space-x-2 mt-2">
                    <div className="aspect-square "> 
                        <Card link="c0" />
                    </div>    
                    <div className="w-12 h-12"> 
                        <Card link="c0" />
                    </div>
                    <div className="w-12 h-12"> 
                        <Card link="c0" />
                    </div>
                </div>
            </div>
            ))}
            <div className="relative w-full max-w-sm max-h-sm">
                <Gameboard /> 
            </div>

            <div className="absolute bottom-0 right-0 m-5 space-x-4 ">
                <button
                onClick={() => {
                    EndTurn(jugadores[turnoActual].jugador_id);
                    setTurnoActual(turnoActual === jugadores.length -1 ? 0 : turnoActual + 1);
                }}
                    className=" border-2 text-white p-2 rounded bg-gray-900 hover:bg-gray-700 transition "
                >
                    Pasar turno
                </button>
                <button
                    onClick={() => {
                        LeaveGame({ player_id: jugadores[turnoActual].jugador_id, game_id });
                        setJugadores(jugadores.filter((_, index) => index !== turnoActual));
                        setTurnoActual(turnoActual === jugadores.length -1 ? turnoActual-1 : turnoActual );
                        
                    }}
                    className=" border-2 text-white p-2 rounded bg-gray-900 hover:bg-gray-700 transition "
                >
                    Abandonar partida
                </button>
            </div>
        </div>
    );
}