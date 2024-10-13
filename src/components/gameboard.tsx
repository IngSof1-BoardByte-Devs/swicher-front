"use client"
import React, { useEffect, useState } from "react";
import { Piece } from "@components/piece";
import { fetch_board } from "@/lib/board";

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
        <div className="w-full grid grid-cols-6" style={{aspectRatio: "1/1"}}>
            {figures.map(({color}, index) => (
                <Piece color={color} index={index} selectedPiece={selectedPiece} setSelectedPiece={setSelectedPiece} key={index} />
            ))}
        </div>
    )
}

export default Gameboard;