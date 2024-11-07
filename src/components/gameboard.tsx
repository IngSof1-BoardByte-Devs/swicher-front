'use client';
import { useCallback, useEffect, useState } from 'react';
// type
import { Piece } from '@/types/piece';
import { FigureCard, MovementCard } from '@/types/card';
// components
import { PieceComponent } from '@components/piece';
import { MovementCardComponent, FigureCardComponent } from '@components/cards';
import { Player_with_turn } from '@/types/player';

export function Gameboard() {
    const [players, setPlayers] = useState<Player_with_turn[]>([
        { player_id: 0, player_name: 'Player 1', turn: 0 },
        { player_id: 1, player_name: 'Player 2', turn: 1 },
        { player_id: 2, player_name: 'Player 3', turn: 2 },
        { player_id: 3, player_name: 'Player 4', turn: 3 },
    ]);
    const [pieces, setpieces] = useState<Piece[]>([
        { color: 0, selected: false },
        { color: 0, selected: false },
        { color: 0, selected: false },
        { color: 0, selected: false },
        { color: 1, selected: false },
        { color: 2, selected: false },
        { color: 0, selected: false },
        { color: 3, selected: false },
    ]);
    const [figureCards, setFigureCards] = useState<FigureCard[]>([
        { player_id: 0, id_figure: 0, type_figure: 1 },
        { player_id: 0, id_figure: 1, type_figure: 2 },
        { player_id: 0, id_figure: 2, type_figure: 3 },
        { player_id: 1, id_figure: 3, type_figure: 4 },
        { player_id: 2, id_figure: 4, type_figure: 5 },
        { player_id: 3, id_figure: 5, type_figure: 6 },
        { player_id: 2, id_figure: 6, type_figure: 7 },
        { player_id: 1, id_figure: 7, type_figure: 8 },
    ]);
    const [movementCards, setMovementCards] = useState<MovementCard[]>([
        { id_movement: 0, type_movement: 1, selected: false },
        { id_movement: 1, type_movement: 2, selected: false },
        { id_movement: 2, type_movement: 3, selected: false },
    ]);
    const [mode, setMode] = useState<boolean>(false);

    function unselectpieces() {
        setpieces(pieces.map((figure) => ({ ...figure, selected: false })));
    }

    function countSelected() {
        return pieces.filter((figure) => figure.selected).length;
    }

    function selectpieces(index: number, color: number) {
        if (mode) {
            setpieces(
                pieces.map((figure, i) =>
                    i === index ? { ...figure, selected: true } : figure,
                ),
            );
            if (countSelected() === 1) {
                unselectpieces();
            }
        } else {
            unselectpieces();
            const selected = SelectMultiplePieces(index, color);
            setpieces(
                pieces.map((figure, index) => ({
                    ...figure,
                    selected: selected.includes(index),
                })),
            );
        }
    }

    function SelectMultiplePieces(startIndex: number, targetColor: number) {
        const visited = new Set<number>();
        const toVisit = [startIndex];

        while (toVisit.length > 0) {
            const index = toVisit.pop();

            if (
                index === undefined ||
                index < 0 ||
                index >= pieces.length ||
                visited.has(index)
            ) {
                continue;
            }

            if (pieces[index].color !== targetColor) {
                continue;
            }
            visited.add(index);
            if (index % 6 !== 0) {
                toVisit.push(index - 1);
            }
            if ((index + 1) % 6 !== 0) {
                toVisit.push(index + 1);
            }
            if (index - 6 >= 0) {
                toVisit.push(index - 6);
            }
            if (index + 6 < pieces.length) {
                toVisit.push(index + 6);
            }
        }
        return Array.from(visited);
    }

    useEffect(() => {
        unselectpieces();
    }, [mode]);

    return (
        <main className="flex flex-col gap-3">
            <div
                style={{ aspectRatio: '1/1' }}
                className="border p-2 grid grid-cols-6 grid-rows-6 w-full h-full gap-1"
            >
                {pieces.map((figure, index) => (
                    <figure
                        key={'pieces' + index}
                        className="w-full h-full grid-"
                    >
                        <button
                            className="w-full h-full"
                            onClick={() => selectpieces(index, figure.color)}
                        >
                            <PieceComponent
                                color={figure.color}
                                selected={figure.selected}
                            />
                        </button>
                    </figure>
                ))}
            </div>
            <div className="border">
                <header className="flex justify-around border-b divide-x-2">
                    <button
                        className={`w-full p-2 ${mode === true ? 'bg-slate-100' : ''}`}
                        onClick={() => setMode(false)}
                    >
                        Figuras
                    </button>
                    <button
                        className={`w-full p-2 ${mode === false ? 'bg-slate-100' : ''}`}
                        onClick={() => setMode(true)}
                    >
                        Movimientos
                    </button>
                </header>
                {!mode && (
                    <div className="p-2">
                        <ul>
                            {players.map((player, index) => (
                                <li
                                    key={'player' + index}
                                    className="flex gap-4"
                                >
                                    <p className="items-center flex">
                                        {player.player_name}
                                    </p>
                                    <figure className="flex gap-2">
                                        {figureCards
                                            .filter(
                                                (card) =>
                                                    card.player_id ===
                                                    player.player_id,
                                            )
                                            .map((card, index) => (
                                                <div
                                                    key={'movement' + index}
                                                    className="w-full h-full"
                                                >
                                                    <FigureCardComponent
                                                        card={card}
                                                    />
                                                </div>
                                            ))}
                                    </figure>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {mode && (
                    <div className="p-2 flex">
                        {movementCards.map((card, index) => (
                            <div
                                key={'figure' + index}
                                className="w-full h-full"
                            >
                                <MovementCardComponent card={card} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Gameboard;
