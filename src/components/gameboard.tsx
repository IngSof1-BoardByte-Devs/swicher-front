import React, { useEffect, useState } from "react";
import { Piece } from "@components/piece";
import { fetch_board } from "@/lib/board";
import { useWebSocket } from "@app/contexts/WebSocketContext";
import { motion } from "framer-motion";

export function Gameboard({ id_game, id_player, selectedTurn, playerTurn }: { id_game: number, id_player: number, selectedTurn: number, playerTurn: number }) {
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null); // Piezas seleccionadas
    const [figures, setFigures] = useState([]); // Figuras en el tablero
    const [moveCard, setMoveCard] = useState("mov6"); // Carta de movimiento seleccionada
    const { socket } = useWebSocket();
    const [swappingPieces, setSwappingPieces] = useState<number[]>([]); // Estado para las piezas en intercambio

    const fetchBoard = async () => {
        try {
            const data = await fetch_board({ id_game });
            setFigures(data.board);
        } catch (err) {
            console.error("Failed to fetch board:", err);
        }
    };

    useEffect(() => {
        fetchBoard();
    }, [id_game]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const socketData = JSON.parse(event.data);
                if (socketData.event === "movement.card.used") {
                    const { index1, index2 } = socketData.payload;
                    setMoveCard(socketData.payload.card_id);
                    swapPieces(index1, index2);
                    fetchBoard();
                } else if (socketData.event === "moves.cancelled") {
                    fetchBoard();
                } else if (socketData.event === "figure.card.used" && (socketData.payload.discarded || socketData.payload.locked || socketData.payload.unlocked)) {
                    
                }
            };
        }
    }, [socket, figures]);

    const swapPieces = (index1: number, index2: number) => {
        setSwappingPieces([index1, index2]); 

        // Esperar a que la animación de desaparición ocurra
        setTimeout(() => {
            setSwappingPieces([]);
        }, 500); // Duración de la animación de desaparición (0.5s)
    };

    function parseIndex(i: number): { x: number, y: number } {
        const x = Math.floor(i / 6); 
        const y = i % 6;             
        console.log("x:", x, "y:", y);
        return { x, y };
    }

    function fillMatrix<T>(list: T[]): T[][] {
        const matrix: T[][] = [];
        
        for (let i = 0; i < 36; i += 6) {
          // Agrupa elementos en subarrays de tamaño 'columns'
          const row = list.slice(i, i + 6);
          matrix.push(row);
        }
      
        return matrix;
      }

    const verifyMovement = (cardSelected: string, selectedPiece: number, index: number) => {
        let result = false;
        const matriz = fillMatrix(figures);
        const primera = parseIndex(selectedPiece);
        const segunda = parseIndex(index);
        console.log(cardSelected)
        
        switch (cardSelected) {
            case "mov1":
                result = ((primera.y +2 === segunda.y && (primera.x+2 === segunda.x || primera.x-2 === segunda.x)) || 
                (primera.y -2 === segunda.y && (primera.x+2 === segunda.x || primera.x-2 === segunda.x)));
                break;
            case "mov2":
                result = (primera.y === segunda.y && (primera.x+2 === segunda.x || primera.x-2 === segunda.x)) || 
                (primera.x === segunda.x && (primera.y+2 === segunda.y || primera.y-2 === segunda.y));
                break;
            case "mov3":
                result = (primera.y === segunda.y && (primera.x+1 === segunda.x || primera.x-1 === segunda.x)) ||
                (primera.x === segunda.x && (primera.y+1 === segunda.y || primera.y-1 === segunda.y));
                break;
            case "mov4":
                result = ((primera.y +1 === segunda.y && (primera.x+1 === segunda.x || primera.x-1 === segunda.x)) || 
                (primera.y -1 === segunda.y && (primera.x+1 === segunda.x || primera.x-1 === segunda.x)));
                break;
            case "mov5":
                if (primera.y+1 === segunda.y && primera.x-2 === segunda.x) {
                    result = true;
                    break;
                    
                }else if (primera.y+2 === segunda.y && primera.x+1 === segunda.x) {
                    result = true;
                    break;
                }else if (primera.y-1 === segunda.y && primera.x+2 === segunda.x) {
                    result = true;
                    break;
                }else if (primera.y-2 === segunda.y && primera.x-1 === segunda.x) {
                    result = true;
                    break;
                }
                break;
            case "mov6":
                //roto horizontal para abajo
                if (primera.y-1 === segunda.y && primera.x-2 === segunda.x) {
                    result = true;
                    break;
                }else if (primera.y+2 === segunda.y && primera.x-1 === segunda.x) {
                    result = true;
                    break;
                }else if (primera.y+1 === segunda.y && primera.x+2 === segunda.x) {
                    result = true;
                    break;
                }else if (primera.y-2 === segunda.y && primera.x+1 === segunda.x) {
                    result = true;
                    break;
                }
                break;
            case "mov7":             
                result = (primera.y === segunda.y && (primera.x+4 === segunda.x || primera.x-4 === segunda.x)) ||
                  (primera.x === segunda.x && (primera.y+4 === segunda.y || primera.y-4 === segunda.y));
                break;
        
            default:
                break;
        }

        if (result) {
            handleSwap(index);           
        }else{
            alert("Las piezas no coinciden con el movimiento seleccionado");
            setSelectedPiece(null);
        }
      }

    // Controlar el intercambio de piezas al hacer clic en dos diferentes
    const handleSwap = (index: number) => {
        if (selectedPiece !== null && selectedPiece !== index) {
            swapPieces(selectedPiece, index); 
            setSelectedPiece(null); 
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
            isSwapping={swappingPieces.includes(index)} 
            verifyMovement={verifyMovement}
            isMoveCardSelected={moveCard !== ""}
            cardSelected={moveCard}
            selectedTurn={selectedTurn}  // Aquí se pasa el turno actual
            playerTurn={playerTurn}      // Aquí se pasa el turno del jugador
        />
    ))}
</motion.div>

    );
}

export default Gameboard;
