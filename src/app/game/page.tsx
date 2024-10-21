"use client";

import { use, useEffect, useState } from "react";
import { Gameboard } from "@/components/gameboard";
import { Card } from "@components/cards";
import { end_turn } from "@/lib/board";
import { fetch_game, leave_game } from "@/lib/game";
import { Winner } from "@/components/winner";
import { useWebSocket } from "@app/contexts/WebSocketContext";
import { useGameInfo } from '@app/contexts/GameInfoContext';
import clsx from "clsx";
import { fetch_figure_cards, fetch_movement_cards, use_movement_cards } from "@/lib/card";
import { useRouter } from "next/navigation";

export function Game() {
    const { socket } = useWebSocket();
    const { id_game, id_player } = useGameInfo();
    const router = useRouter()


    const [color, setColor] = useState(-1);
    const [selectedTurn, setSelectedTurn] = useState(-1);
    const [playerTurn, setPlayerTurn] = useState(-1);
    const [gameName, setGameName] = useState("");

    const [players, setPlayers] = useState<Player[]>([]);
    const [movementCards, setMovementCards] = useState<MoveCard[]>([]);
    const [figureCards, setFigureCards] = useState<FigureCard[]>([]);
    const [selectedMovementCard, setSelectedMovementCard] = useState<string | null >(null);
    const [selectedFigureCard, setSelectedFigureCard] = useState<string | null >(null);
    const [moveCard, setMoveCard] = useState<string>("");
    const [winnerPlayer, setWinnerPlayer] = useState<Player | null>(null);

    const [socketDataMove, setSocketDataMove] = useState<any>(null);
    const [socketDataCancel, setSocketDataCancel] = useState<any>(null);
    const [socketDataFigure, setSocketDataFigure] = useState<any>(null);

    interface Player {
        id: number;
        username: string;
        turn: number;
    }
    interface FigureCard {
        player_id: number;
        id_figure: number;
        type_figure: string
    }

    interface MoveCard {
        id_movement: number;
        type_movement: string;
        // Add other properties as needed
    }

    
    useEffect(() => {
        const fetchGame = async () => {
            try {
                if (id_game == null) return;
                const data = await fetch_game({ game_id: id_game });
                setPlayers(data.players);
                setGameName(data.name);
                setColor(data.bloqued_color);
                setSelectedTurn(data.turn);
                for (const player of data.players) {
                    if (player.id === id_player) {
                        setPlayerTurn(player.turn);
                        break;
                    }
                }
                setSelectedTurn(data.turn);
                for (const player of data.players) {
                    if (player.id === id_player) {
                        setPlayerTurn(player.turn);
                        break;
                    }
                }
            } catch (err) {
                console.error("Failed to fetch players:", err);
            }
        };
        if (id_game !== null) {
            fetch_figure_cards({ id_game }).then((data: FigureCard[]) => {
                setFigureCards(data);
            });
        }
        if (id_player !== null) {
            fetch_movement_cards({ id_player }).then((data: MoveCard[]) => {
                setMovementCards(data)
            });
        }

        fetchGame();
    }, [id_game, id_player, selectedTurn]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const socketData = JSON.parse(event.data);
                const command = socketData.event.split(".");
                console.log(command);
                if (command[0] === "game") {
                    if (command[1] === "turn") {
                        setSelectedTurn(socketData.payload.turn);
                    } else if (command[1] === "winner") {
                        const winner = players.find(player => player.id === socketData.payload.player_id);
                        if (winner) {
                            setWinnerPlayer(winner);
                        }
                    } else if (command[1] === "figures") {
                        setSocketDataFigure(socketData.payload);
                    }
                } else if (command[0] === "player") {
                    if (command[1] === "left") {
                        setPlayers(players => players.filter(player => player.username !== socketData.payload.username));
                    }
                }else if (command[0] === "movement") {
                    if (command[1] === "card") {
                        setSocketDataMove(socketData.payload);
                    }
                }else if (command[0] === "moves") {
                    if (command[1] === "cancelled") {
                        setSocketDataCancel(socketData.payload);
                    }
                }
            };
        }
    }, [socket, players]);

    function callUseMoveCard(id_player:number, index1:number, index2:number) {
        if (id_player !== null) {
            const card = movementCards.find(card => card.type_movement === moveCard?.replace("mov", "Type ") );
            if (card) {
                use_movement_cards({ id_player, id_card: card.id_movement, index1, index2 });
            }
        }
    }
    const currentPlayer = players.find(player => player.id === id_player);
    const rivales = players.filter(player => player.id !== id_player);
    
    return (
        <div className="w-screen h-screen grid grid-rows-10 grid-cols-12 md:grid-rows-12 items-center justify-center overflow-hidden p-4">
            {winnerPlayer && (
                <div className="z-50">
                    <Winner player_name={winnerPlayer.username} />
                </div>
            )}
            {/* Header: Turno Actual, Nombre de Partida y Color Bloqueado */}
            <div className="col-span-12 place-content-center text-center h-full grid grid-cols-2">
                <p className="text-2xl font-bold">Partida: {gameName}</p>
                <div>
                    <p className="text-2xl font-bold">Blocked: {clsx({
                        "red ": color === 0,
                        "green": color === 1,
                        "blue": color === 2,
                        "violet": color === 3,
                        "None": color === null,
                    })}</p>
                </div>
            </div>
            {/* Tablero de juego */}
            <div className="h-full row-span-4 col-span-12 md:row-span-6 md:col-span-4 md:row-start-4 md:col-start-5">
            {id_game !== null && id_player !== null && <Gameboard 
                                                                id_game={id_game} 
                                                                id_player={id_player}
                                                                selectedTurn={selectedTurn} 
                                                                playerTurn={playerTurn} 
                                                                moveCard={moveCard}
                                                                callUseMoveCard={callUseMoveCard}
                                                                socketDataMove={socketDataMove}
                                                                setSocketDataMove={setSocketDataMove}
                                                                socketDataCancel={socketDataCancel}
                                                                setSocketDataCancel={setSocketDataCancel}
                                                                socketDataFigure={socketDataFigure}
                                                                setSocketDataFigure={setSocketDataFigure}
                                                                />}

            </div>
            {/* current player */}
            {currentPlayer && (
                <div className="md:row-start-10 md:col-start-2 md:col-end-11 md:row-span-2 col-span-12 w-full h-full p-1">
                    <div className="grid grid-cols-7 w-full h-full items-center justify-center ">
                        <div className="grid grid-cols-6 md:grid-rows-2 w-full h-full items-center justify-center">
                            <div className={clsx(
                                "font-bold w-fit p-1 md:flex md:justify-center md:text-xl md:text-center md:items-center",
                                {
                                    "bg-black text-white rounded dark:bg-white dark:text-black": selectedTurn === currentPlayer.turn,
                                }
                            )}>
                                {currentPlayer.username}
                            </div>
                        </div>
                        <div className="col-span-6 grid grid-cols-6 w-full h-full gap-1 md:grid-rows-1">
                            {figureCards.filter(card => card.player_id === currentPlayer.id).map((figure: FigureCard, index_id) => (
                                <button key={figure.id_figure} className="w-full h-full">
                                    <Card 
                                    type={true} 
                                    index={parseInt(figure.type_figure.split(" ")[1], 10)} 
                                    id = {`figure-${index_id}`} 
                                    selectedCard={selectedFigureCard} 
                                    setSelectedCard={setSelectedFigureCard}
                                    isSelectable={selectedTurn === currentPlayer.turn}
                                    setMoveCard={setMoveCard}/>
                                </button>
                            ))}
                            {movementCards.map((movement: MoveCard, index_id) => (
                                <button key={movement.id_movement} className="w-full h-full">
                                    <Card 
                                    type={false} 
                                    index={parseInt(movement.type_movement.split(" ")[1], 10)} 
                                    id = {`movement-${index_id}`} 
                                    selectedCard={selectedMovementCard} 
                                    setSelectedCard={setSelectedMovementCard}
                                    isSelectable={selectedTurn === currentPlayer.turn}
                                    setMoveCard={setMoveCard}/>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* rivales */}
            {rivales.map((player: Player, index) => {
                return (
                    <div key={player.id + index} className={clsx(
                        "col-span-12 w-full h-full p-1",
                        {
                            "md:row-start-2 md:row-span-2 md:col-start-4":index === 0,
                            "md:row-start-5 md:row-span-3  md:col-span-4":index === 1,
                            "md:row-start-5 md:col-start-9 md:row-span-3  md:col-span-4":index === 2,
                        }
                    )}>
                        <div className={clsx(
                            "grid grid-cols-7 w-full h-full items-center justify-center ",
                            {
                                "md:grid-rows-2":index === 0,
                                "md:grid-cols-4 md:grid-rows-3":index === 1 || index === 2,
                            }

                        )}>
                            <div className={clsx("font-bold w-fit p-1  md:flex md:justify-center md:text-xl md:text-center md:items-center ",
                                {
                                    "bg-black text-white rounded dark:bg-white dark:text-black": selectedTurn === player.turn,
                                })}>{player.username}</div>
                            <div className={clsx(
                                "col-span-6 grid grid-cols-6 w-full h-full gap-1",
                                {
                                    "md:row-span-2":index === 0,
                                    "md:row-span-2 md:grid-cols-3":index === 1 || index === 2,
                                }

                            )}>
                                {figureCards.filter(card => card.player_id === player.id).map((figure: FigureCard, index_id) => (
                                    <button key={figure.id_figure} className="w-full h-full">
                                        <Card 
                                        type={true} 
                                        index={parseInt(figure.type_figure.split(" ")[1], 10)} 
                                        id = {`rival-${index}-figure-${index_id}`} 
                                        selectedCard={selectedFigureCard} 
                                        setSelectedCard={setSelectedFigureCard}
                                        isSelectable={selectedTurn === playerTurn}
                                        setMoveCard={setMoveCard}/>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
            {/* botones */}
            <div className="md:row-start-12 col-span-12 grid grid-cols-2  md:flex md:justify-between h-full p-2 gap-2">

                {players.reduce((acc, player) =>
                    player.id !== id_player && acc
                    , true) ? <button
                        className="col-span-2 md:justify-start p-1 border-2 text-white rounded bg-slate-700 hover:hover:bg-gray-700/95 dark:rounded-none dark:bg-inherit dark:hover:bg-gray-600 disabled:hover:dark:bg-inherit disabled:opacity-50"
                        onClick={() => {
                            router.push("/")
                        }}
                    >Salir</button> : <>
                    <button
                        className={`${playerTurn !== selectedTurn ? "hidden" : "md:justify-start p-1 border-2 text-white rounded bg-slate-700 hover:hover:bg-gray-700/95 dark:rounded-none dark:bg-inherit dark:hover:bg-gray-600 disabled:hover:dark:bg-inherit disabled:opacity-50"}`}
                        onClick={() => {
                            if (id_player !== null) {
                                end_turn(id_player);
                            }
                        }}>terminar turno</button>
                    <button
                        onClick={async () => {
                            if (id_player !== null) {
                                await leave_game({ player_id: id_player })
                                const new_players = players.filter(player => player.id !== id_player)
                                setPlayers(new_players)
                            }
                        }}
                        className={`md:justify-end p-1 border-2 text-white rounded bg-slate-700 hover:hover:bg-gray-700/95 dark:rounded-none dark:bg-inherit dark:hover:bg-gray-600 ${playerTurn !== selectedTurn ? "col-span-2" : ""}`}>abandonar partida</button>
                </>}
            </div>
        </div >
    );
}

export default Game;