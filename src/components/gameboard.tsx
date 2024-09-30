"use client"
import React, { useEffect, useState } from "react";
import Piece from "./piece";

import { fetch_board } from "@/lib/board";
import clsx from "clsx";

export function Gameboard({ id_game }: { id_game: number }) {
    const [selectedPiece, setSelectedPiece] = useState<number>(-1);
    const [figures, setFigures] = useState([]);

    useEffect(() => {
    const fetchBoard = async () => {
        try {
            const data = await fetch_board({ id_game });
            setFigures(data.board);
        } catch (err) {
            console.error("Failed to fetch board:", err);
        }
    } 
    fetchBoard();
    }, [id_game]);
    
    return (
        <div role="grid" className="w-full h-full grid grid-cols-6 justify-items-center grid-rows-6">
            {figures.map(({color}, index) => (
                <Piece color={clsx({
                    "red": color === 0,
                    "green": color === 1,
                    "blue": color === 2,
                    "violet": color === 3,
                })} index={index} selectedPiece={selectedPiece} setSelectedPiece={setSelectedPiece} key={index} />
            ))}
        </div>
    )
}

export default Gameboard;