"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Piece } from "@components/piece";
import { fetch_board } from "@/lib/board";
import { useGameInfo } from '@app/contexts/GameInfoContext';
import { motion } from "framer-motion";

export function Gameboard({ selectedTurn, playerTurn, moveCard, callUseMoveCard, socketDataMove, setSocketDataMove, socketDataCancel, setSocketDataCancel }: 
    { id_game: number, id_player: number, selectedTurn: number, playerTurn: number, socketDataMove:any, setSocketDataMove:(data:any)=>void, setSocketDataCancel:(data:any)=>void, socketDataCancel:any , moveCard: string, callUseMoveCard: (id_player: number, index1: number, index2: number ) => void }) {
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null); // Piezas seleccionadas
    const [figures, setFigures] = useState<{ color: number }[]>([]);
    const [selected, setSelected] = useState<number | undefined>();
    const [selectedFigures, setSelectedFigures] = useState<number[]>([]);
    const { id_game, id_player } = useGameInfo();
    const [swappingPieces, setSwappingPieces] = useState<number[]>([]); // Estado para las piezas en intercambio

    

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                if (id_game) {
                    
                    const data = await fetch_board({ id_game });
                    setFigures(data.board);
                }
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
    useEffect(() => {
        if (socketDataMove) {
            const { position1, position2 } = socketDataMove;
            swapPieces(position1, position2);
            setSelectedPiece(null);
            setSocketDataMove(null);
        }else if (socketDataCancel) {
            socketDataCancel.forEach(({ card_id, position1, position2 }: { card_id: number, position1: number, position2: number }) => {
                swapPieces(position1, position2);
            });
            setSocketDataCancel(null);
        }
    }, [socketDataCancel, socketDataMove]);

    const swapPieces = (index1: number, index2: number) => {
        setSwappingPieces([index1, index2]); 
        // Actualiza el estado del tablero con el intercambio
        setFigures((prevFigures) => {
            const newFigures = [...prevFigures];
            [newFigures[index1], newFigures[index2]] = [newFigures[index2], newFigures[index1]];
            return newFigures;
        });
    
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


    const verifyMovement = (cardSelected: string, selectedPiece: number, index: number) => {
        let result = false;
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
            if (id_player) {
                callUseMoveCard(id_player, selectedPiece, index );
                setSelectedPiece(null);
            }
        }else{
            alert("Las piezas no coinciden con el movimiento seleccionado");
            setSelectedPiece(null);
        }
      }
    
    return (
        <div className="flex w-full h-full item justify-center content-center p-8">
            <motion.div
            role="grid"
            layout
            className="w-auto h-auto grid grid-cols-6" 
            style={{ aspectRatio: "1 / 1" }}>
                {figures.map(({ color }, index) => (
                    <Piece 
                        color={color}
                        key={index}
                        selected={selectedFigures.includes(index)}
                        index={index}
                        setSelected={setSelected}
                        isSwapping={swappingPieces.includes(index)}
                        verifyMovement={verifyMovement}
                        isMoveCardSelected={moveCard !== ""}
                        cardSelected={moveCard}
                        selectedTurn={selectedTurn} // Aquí se pasa el turno actual
                        playerTurn={playerTurn} // Aquí se pasa el turno del jugador
                        setSelectedPiece={setSelectedPiece} 
                        selectedPiece={selectedPiece}
                        />
                ))}
            </motion.div>
        </div>
    );
}

export default Gameboard;
