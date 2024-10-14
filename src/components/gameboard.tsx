import React, { useEffect, useState } from "react";
import { Piece } from "@components/piece";
import { fetch_board } from "@/lib/board";
import { useWebSocket } from "@app/contexts/WebSocketContext";
import { motion } from "framer-motion";

export function Gameboard({ id_game }: { id_game: number }) {
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null); // Piezas seleccionadas
    const [figures, setFigures] = useState([]); // Figuras en el tablero
    const { socket } = useWebSocket();
    const [permanentBoard, setPermanentBoard] = useState([]);
    const [temporalBoard, setTemoralBoard] = useState([]);
    const [swappingPieces, setSwappingPieces] = useState<number[]>([]); // Estado para las piezas en intercambio

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
                    swapPieces(index1, index2);
                } else if (socketData.event === "moves.cancelled") {
                    setTemoralBoard(permanentBoard);
                    setFigures(permanentBoard);
                } else if (socketData.event === "figure.card.used" && (socketData.payload.discarded || socketData.payload.locked || socketData.payload.unlocked)) {
                    setPermanentBoard(temporalBoard);
                }
            };
        }
    }, [socket, permanentBoard, temporalBoard]);

    // Función para intercambiar piezas
    const swapPieces = (index1: number, index2: number) => {
        setSwappingPieces([index1, index2]); // Indicar que las piezas están en intercambio

        // Esperar a que la animación de desaparición ocurra
        setTimeout(() => {
            setTemoralBoard((prevBoard) => {
                const newBoard = [...prevBoard];
                // Intercambiar las piezas
                [newBoard[index1], newBoard[index2]] = [newBoard[index2], newBoard[index1]];
                setFigures(newBoard); // Actualizar el tablero con las nuevas posiciones
                return newBoard;
            });

            // Terminar el intercambio después de la animación
            setSwappingPieces([]);
        }, 500); // Duración de la animación de desaparición (0.5s)
    };

    // Controlar el intercambio de piezas al hacer clic en dos diferentes
    const handleSwap = (index: number) => {
        if (selectedPiece !== null && selectedPiece !== index) {
            swapPieces(selectedPiece, index); // Realizar el intercambio
            setSelectedPiece(null); // Reiniciar la selección
        }
    };

    return (
        <motion.div
            role="grid"
            layout
            className="w-full h-full grid grid-cols-6 justify-items-center grid-rows-6"
        >
            {figures.map(({ color }, index) => (
                <Piece
                    key={index}
                    color={color}
                    index={index}
                    selectedPiece={selectedPiece}
                    setSelectedPiece={setSelectedPiece}
                    isSwapping={swappingPieces.includes(index)} // Pasar si está ocurriendo un intercambio en este índice
                    handleSwap={handleSwap}
                />
            ))}
        </motion.div>
    );
}

export default Gameboard;
