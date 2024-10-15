"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Piece } from "@components/piece";
import { fetch_board } from "@/lib/board";

export function Gameboard({ id_game }: { id_game: number }) {
    const [figures, setFigures] = useState<{ color: number }[]>([]);
    const [selected, setSelected] = useState<number | undefined>();
    const [selectedFigures, setSelectedFigures] = useState<number[]>([]);

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const data = await fetch_board({ id_game });
                setFigures(data.board);
            } catch (err) {
                console.error("Failed to fetch board:", err);
            }
        };
        fetchBoard();
    }, [id_game]);

    const colorFigure = useCallback(
        (startIndex: number, targetColor: number) => {
            const visited = new Set<number>();
            const toVisit = [startIndex];

            while (toVisit.length > 0) {
                const index = toVisit.pop();

                if (index === undefined || index < 0 || index >= figures.length || visited.has(index)) {
                    continue;
                }

                if (figures[index].color !== targetColor) {
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
                if (index + 6 < figures.length) {
                    toVisit.push(index + 6);
                }
            }
            setSelectedFigures(Array.from(visited));
        }, [figures]);

    useEffect(() => {
        if (selected !== undefined) {
            colorFigure(selected, figures[selected].color);
        } else {
            setSelectedFigures([]);
        }
    }, [selected, figures, colorFigure]);

    return (
        <div className="w-full grid grid-cols-6" style={{ aspectRatio: "1/1" }}>
            {figures.map(({ color }, index) => (
                <Piece color={color} key={index} selected={selectedFigures.includes(index)} index={index} setSelected={setSelected} />
            ))}
        </div>
    );
}

export default Gameboard;
