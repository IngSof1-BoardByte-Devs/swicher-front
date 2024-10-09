"use client"
import React, { useEffect, useState } from "react";
import { Piece } from "@components/piece";
import { fetch_board } from "@/lib/board";
import { useWebSocket } from "@app/contexts/WebSocketContext";


export function Gameboard({ id_game }: { id_game: number }) {
    const [selectedPiece, setSelectedPiece] = useState<number>(-1);
    const [figures, setFigures] = useState([]);
    const { socket } = useWebSocket();
    const [permanentBoard, setPermanentBoard] = useState([]);
    const [temporalBoard, setTemoralBoard] = useState([]);

    useEffect(() => {
    const fetchBoard = async () => {
        try {
            const data = await fetch_board({ id_game });
            setFigures(data.board);
            setPermanentBoard(data.board);
            setTemoralBoard(data.board);
        } catch (err) {
            console.error("Failed to fetch board:", err);
        }
    } 
    fetchBoard();
    }, [id_game]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const socketData = JSON.parse(event.data);
                if (socketData.event === "movement.card.used") {
                    const { index1, index2 } = socketData.payload;
                    setTemoralBoard((prevBoard) => {
                        const newBoard = [...prevBoard];
                        [newBoard[index1], newBoard[index2]] = [newBoard[index2], newBoard[index1]];
                        return newBoard;
                    });
                    setFigures(temporalBoard);
                } else if (socketData.event === "moves.cancelled") {
                 setTemoralBoard(permanentBoard);   
                 setFigures(permanentBoard);
                } else if (socketData.event === "figure.card.used" && socketData.payload.discarded) {
                 setPermanentBoard(temporalBoard);
                }
    
            };
        }
    }, [socket]);
    
    return (
        <div role="grid" className="w-full h-full grid grid-cols-6 justify-items-center grid-rows-6">
            {figures.map(({color}, index) => (
                <Piece color={color} index={index} selectedPiece={selectedPiece} setSelectedPiece={setSelectedPiece} key={index} />
            ))}
        </div>
    )
}

export default Gameboard;