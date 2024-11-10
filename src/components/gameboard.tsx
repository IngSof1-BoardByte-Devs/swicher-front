"use client"
import React, { useEffect, useState } from "react";
import { Piece } from "@components/piece";
import { fetch_board } from "@/lib/board";
import { useGameInfo } from '@app/contexts/GameInfoContext';
import { color, motion } from "framer-motion";

export function Gameboard({ selectedTurn, playerTurn, moveCard, callUseMoveCard, figCard, figCardId, movCardId, callUseFigCard, socketDataMove, setSocketDataMove, socketDataCancel, setSocketDataCancel, socketDataFigure, setSocketDataFigure, blockedColor }:
    { id_game: number, id_player: number, selectedTurn: number, playerTurn: number, socketDataMove: any,
     setSocketDataMove: (data: any) => void, setSocketDataCancel: (data: any) => void, socketDataCancel: any, moveCard: string,
     callUseMoveCard: (id_player: number, index1: number, index2: number, card_id: number)=>void, socketDataFigure: any, setSocketDataFigure: (data: any) => void,
     figCard: string, figCardId: number | null, movCardId: number | null, callUseFigCard: (id_player: number, id_card: number, color: number) => void, blockedColor: number }) {
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null); // Piezas seleccionadas
    const [figures, setFigures] = useState<{ color: number }[]>([]);
    const [selected, setSelected] = useState<number | undefined>();
    const { id_game, id_player } = useGameInfo();
    const [swappingPieces, setSwappingPieces] = useState<number[]>([]); // Estado para las piezas en intercambio
    const [figuresInBoard, setFiguresInBoard] = useState<Figure[]>([]);
    const [highlightedPieces, setHighlightedPieces] = useState<number[]>([]);

    interface Figure {
        type: string;
        indexes: number[];
    }

    const fetchBoard = async () => {
        try {
            if (id_game) {

                const data = await fetch_board({ id_game });
                setFigures(data.board);
            }
        } catch (err) {
            console.error("Failed to fetch board:", err);
        }
    }

    useEffect(() => {

        fetchBoard();
    }, [id_game]);

    useEffect(() => {
        if (socketDataMove) {
            const { position1, position2 } = socketDataMove;
            swapPieces(position1, position2);
            setSelectedPiece(null);
            setSocketDataMove(null);
            setFiguresInBoard([]);
            fetchBoard();
        } else if (socketDataCancel) {
            socketDataCancel.forEach(({ card_id, position1, position2 }: { card_id: number, position1: number, position2: number }) => {
                swapPieces(position1, position2);
            });
            setSocketDataCancel(null);
            setFiguresInBoard([]);
            fetchBoard();
        } else if (socketDataFigure) {
            console.log("Recibido socketDataFigure:", socketDataFigure);

            const newFigures = socketDataFigure.map((figure: { type: string, indexes: number[] }) => ({
                type: figure.type,
                indexes: figure.indexes
            }));
            setFiguresInBoard(newFigures); // Actualiza el estado con las nuevas figuras
            setHighlightedPieces(newFigures.flatMap((figure: { indexes: number }) => figure.indexes)); // Actualiza las piezas resaltadas
            setSocketDataFigure(null);
        }


    }, [socketDataCancel, socketDataMove, socketDataFigure]);

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
                result = ((primera.y + 2 === segunda.y && (primera.x + 2 === segunda.x || primera.x - 2 === segunda.x)) ||
                    (primera.y - 2 === segunda.y && (primera.x + 2 === segunda.x || primera.x - 2 === segunda.x)));
                break;
            case "mov2":
                result = (primera.y === segunda.y && (primera.x + 2 === segunda.x || primera.x - 2 === segunda.x)) ||
                    (primera.x === segunda.x && (primera.y + 2 === segunda.y || primera.y - 2 === segunda.y));
                break;
            case "mov3":
                result = (primera.y === segunda.y && (primera.x + 1 === segunda.x || primera.x - 1 === segunda.x)) ||
                    (primera.x === segunda.x && (primera.y + 1 === segunda.y || primera.y - 1 === segunda.y));
                break;
            case "mov4":
                result = ((primera.y + 1 === segunda.y && (primera.x + 1 === segunda.x || primera.x - 1 === segunda.x)) ||
                    (primera.y - 1 === segunda.y && (primera.x + 1 === segunda.x || primera.x - 1 === segunda.x)));
                break;
            case "mov5":
                if (primera.y + 1 === segunda.y && primera.x - 2 === segunda.x) {
                    result = true;
                    break;

                } else if (primera.y + 2 === segunda.y && primera.x + 1 === segunda.x) {
                    result = true;
                    break;
                } else if (primera.y - 1 === segunda.y && primera.x + 2 === segunda.x) {
                    result = true;
                    break;
                } else if (primera.y - 2 === segunda.y && primera.x - 1 === segunda.x) {
                    result = true;
                    break;
                }
                break;
            case "mov6":
                //roto horizontal para abajo
                if (primera.y - 1 === segunda.y && primera.x - 2 === segunda.x) {
                    result = true;
                    break;
                } else if (primera.y + 2 === segunda.y && primera.x - 1 === segunda.x) {
                    result = true;
                    break;
                } else if (primera.y + 1 === segunda.y && primera.x + 2 === segunda.x) {
                    result = true;
                    break;
                } else if (primera.y - 2 === segunda.y && primera.x + 1 === segunda.x) {
                    result = true;
                    break;
                }
                break;
            case "mov7":
                result = (primera.y === segunda.y && (primera.x + 4 === segunda.x || primera.x - 4 === segunda.x)) ||
                    (primera.x === segunda.x && (primera.y + 4 === segunda.y || primera.y - 4 === segunda.y));
                break;

            default:
                break;
        }
        if (result) {
            if (id_player && movCardId) {
                callUseMoveCard(id_player, selectedPiece, index, movCardId);
                setSelectedPiece(null);
            }
        } else {
            alert("Las piezas no coinciden con el movimiento seleccionado");
            setSelectedPiece(null);
        }
    }

    const verifyFigure = (index: number, card:string, color: number) => {
        let result = false;
        const figure = figuresInBoard.find((fig: Figure) => fig.indexes.includes(index));
        if (figure) {
            if (figure.type === card) {
                if(color != blockedColor){
                    result = true;
                }else{
                    alert("El color de la figura esta bloqueado");
                }
            }else{
                alert("La figura seleccionada no coincide con la carta seleccionada");
            }
        }else{
            alert("La pieza seleccionada no tiene una figura");
        }
        if (result) {
            if (id_player && figCardId) {
                callUseFigCard(id_player, figCardId, color);
            }
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
                        selected={highlightedPieces.includes(index)}
                        index={index}
                        setSelected={setSelected}
                        isSwapping={swappingPieces.includes(index)}
                        verifyMovement={verifyMovement}
                        verifyFigure={verifyFigure}
                        isFigCardSelected={figCard !== ""}
                        isMoveCardSelected={moveCard !== ""}
                        cardSelected={ moveCard !== "" ? moveCard : figCard}
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
