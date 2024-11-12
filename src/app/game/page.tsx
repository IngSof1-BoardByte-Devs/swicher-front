"use client";

import { useEffect, useState } from "react";
import { Gameboard } from "@/components/gameboard";
import { Card } from "@components/cards";
import { end_turn } from "@/lib/board";
import { fetch_game, leave_game, revert_movements } from "@/lib/game";
import { Winner } from "@/components/winner";
import { useWebSocket } from "@app/contexts/WebSocketContext";
import { useGameInfo } from '@app/contexts/GameInfoContext';
import clsx from "clsx";
import { fetch_figure_cards, fetch_movement_cards, use_figure_cards, use_movement_cards } from "@/lib/card";
import { useRouter } from "next/navigation";
import { a } from "framer-motion/client";
import CountDown from "@components/countDown";
import ChatComponent from "@/components/chat";
import { useChat } from "../contexts/ChatContext";

export function Game() {
    const { socket } = useWebSocket();
    const { id_game, id_player } = useGameInfo();
    const router = useRouter()


    const [color, setColor] = useState(-1);
    const [selectedTurn, setSelectedTurn] = useState(-1);
    const [playerTurn, setPlayerTurn] = useState(-1);
    const [gameName, setGameName] = useState("");
    const [hasMovement, setHasMovement] = useState(false);

    const [players, setPlayers] = useState<Player[]>([]);
    const [movementCards, setMovementCards] = useState<MoveCard[]>([]);
    const [figureCards, setFigureCards] = useState<FigureCard[]>([]);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [moveCard, setMoveCard] = useState<string>("");
    const [figCard, setFigCard] = useState<string>("");
    const [figCatdId, setFigCardId] = useState<number | null>(null);
    const [movCardId, setMovCardId] = useState<number | null>(null);
    const [usedCards, setUsedCards] = useState<number[]>([]);
    const [blockedCards, setBlockedCards] = useState<number[]>([]);
    const [lockedPlayers, setLockedPlayers] = useState<number[]>([]);
    const [winnerPlayer, setWinnerPlayer] = useState<Player | null>(null);
    const [figDeck, setFigDeck] = useState<FigDeck[]>([]);

    const [socketDataMove, setSocketDataMove] = useState<any>(null);
    const [socketDataCancel, setSocketDataCancel] = useState<any>(null);
    const [socketDataFigure, setSocketDataFigure] = useState<any>(null);


    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [turnStartTime, setTurnStartTime] = useState<number | null>(null);
    const [turnDuration, setTurnDuration] = useState(120); // Duración del turno en segundos

    const [isChatOpen, setIsChatOpen] = useState(false); 
    const { messages, addMessage } = useChat();

    interface Player {
        id: number;
        username: string;
        turn: number;
    }
    interface FigureCard {
        player_id: number;
        id_figure: number;
        type_figure: string
        locked: boolean;
    }

    interface MoveCard {
        id_movement: number;
        type_movement: string;
        // Add other properties as needed
    }

    interface FigDeck {
        player_id: number;
        deck: number;
    }


    useEffect(() => {
        const fetchGame = async () => {
            try {
                if (id_game == null) return;
                const data = await fetch_game({ game_id: id_game });
                setPlayers(data.players);
                setGameName(data.name);
                setSelectedTurn(data.turn);
                setTurnStartTime(Date.now() / 1000);
                setIsTimerRunning(true);
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
                console.log(data);
            });
        }
        if (id_player !== null) {
            fetch_movement_cards({ id_player }).then((data: MoveCard[]) => {
                setMovementCards(data)
                console.log(data);
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
                        setIsTimerRunning(true);
                        setTurnStartTime(Date.now() / 1000); // tiempo en segundos
                        setTurnDuration(120);

                        if (id_player) {
                            fetch_movement_cards({ id_player }).then((data: MoveCard[]) => {
                                setMovementCards(data);
                            });
                        }
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
                } else if (command[0] === "figure") {
                    if (command[1] === "card") {
                        if (command[2] === "used") {
                            console.log(socketData);
                            if (socketData.payload.locked === true) {
                                setBlockedCards([...blockedCards, socketData.payload.card_id]);
                            } else {
                                setFigureCards(figureCards.filter(card => card.id_figure !== socketData.payload.card_id && card.player_id !== socketData.payload.player_id));
                            }
                            setMovementCards(movementCards.filter(card => !usedCards.includes(card.id_movement)));
                            setUsedCards([]);
                            setColor(socketData.payload.color);
                        } else if (command[2] === "unlocked") {
                            console.log("asdfffffffffffasdfsdaasdfasdf");
                            setBlockedCards(blockedCards.filter(card => card !== socketData.payload.card_id));
                            setLockedPlayers(lockedPlayers.filter(player => player !== socketData.payload.player_id));
                        }else if (command[2] === "deck") {
                            setFigDeck(socketData.payload);
                        }
                    }
                } else if (command[0] === "movement") {
                    if (command[1] === "card") {
                        setUsedCards([...usedCards, socketData.payload.card_id]);
                        setSocketDataMove(socketData.payload);
                    }
                } else if (command[0] === "moves") {
                    if (command[1] === "cancelled") {
                        setSocketDataCancel(socketData.payload);
                    }
                }
            };
        }
    }, [socket, players, usedCards, figureCards, movementCards, blockedCards, turnStartTime, isTimerRunning, figDeck, lockedPlayers]);

    useEffect(() => {
        if (socket) {
            const handleMessage = (event: MessageEvent) => {
                const socketData = JSON.parse(event.data);
                const command = socketData.event.split(".");
                if (command[0] === "message" && command[1] === "chat") {
                    const newMessage = socketData.payload.username + ": " + socketData.payload.message;
                    addMessage(newMessage);
                }
                if (command[0] === "message" && command[1] === "action") {
                    const newMessage = "_"+socketData.payload.message+"_";
                    addMessage(newMessage);
                }
            };

            socket.addEventListener("message", handleMessage);

            return () => {
                socket.removeEventListener("message", handleMessage);
            };
        }
    }, [socket, addMessage]);

    async function callUseMoveCard(id_player: number, index1: number, index2: number, id_card: number ) {
        if (id_player !== null) {

            if (id_card) {
                const resp = await use_movement_cards({ id_player, id_card: id_card, index1, index2 });
                console.log(resp);
                if (resp === 'Carta usada con exito!') {
                    setHasMovement(true);
                } else {
                    alert(resp);
                }
            }
        }
    }

    async function callUseFigCard(id_playerr: number, id_card: number, color: number) {
        const figureCard = figureCards.find(card => card.id_figure === id_card);
        const playersCards = figureCards.filter(card => card.player_id === figureCard?.player_id);

        if (figureCard && lockedPlayers.includes(figureCard.player_id) && figureCard.player_id !== id_player) {
            alert("El jugador ya tiene una carta bloqueada");
            return;
        } else if (playersCards.length === 1 && figureCard && figureCard.player_id !== id_player) {
            alert("No se puede bloquear un jugador con una sola carta");
            return;
        } else if (blockedCards.includes(id_card)) {
            alert("Esta carta esta bloqueada");
            return;
        }
        if (id_playerr !== null && id_card !== null) {
            const resp = await use_figure_cards({ id_playerr, id_card: id_card, color });
            console.log(resp);
            if (resp === "Carta usada con exito!") {
                if (figureCard && figureCard.player_id !== id_player) {
                    setLockedPlayers([...lockedPlayers, figureCard.player_id]);
                }
                setHasMovement(false);
            } else {
                alert(resp);
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
            <div className={clsx("col-span-12 place-content-center text-center h-full grid", {
                "grid-cols-3": isTimerRunning,
                "grid-cols-2": !isTimerRunning,
            })}>
                <div><p className="text-2xl font-bold">Partida: {gameName}</p>
                <button 
                    className="mt-2 text-black border-neutral-500 dark:text-white  py-1 px-4 border rounded hover:bg-slate-400" 
                    onClick={() => setIsChatOpen(true)}
                >
                Abrir Chat
                </button></div>
                {isTimerRunning && turnStartTime && (
                    <CountDown
                        startTime={turnStartTime}
                        duration={turnDuration}
                        onEnd={() => {
                            const endTurnButton = document.getElementById("end-turn-button");
                            if (endTurnButton && playerTurn === selectedTurn) {
                                endTurnButton.click();
                            }
                            setIsTimerRunning(false);
                        }}
                    />
                )}
                <div>
                    <p className="text-2xl font-bold">
                        BLOQUEADO:{" "}
                        <span className={clsx(
                            {
                                "text-purple-500": color === 0,
                                "text-red-500": color === 1,
                                "text-blue-500": color === 2,
                                "text-green-500": color === 3,
                            }
                        )}>
                            {color === 0 ? "VIOLETA" :
                                color === 1 ? "ROJO" :
                                    color === 2 ? "AZUL" :
                                        color === 3 ? "VERDE" : "-"}
                        </span>
                    </p>
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
                    movCardId={movCardId}
                    callUseMoveCard={callUseMoveCard}
                    figCard={figCard}
                    figCardId={figCatdId}
                    callUseFigCard={callUseFigCard}
                    socketDataMove={socketDataMove}
                    setSocketDataMove={setSocketDataMove}
                    socketDataCancel={socketDataCancel}
                    setSocketDataCancel={setSocketDataCancel}
                    socketDataFigure={socketDataFigure}
                    setSocketDataFigure={setSocketDataFigure}
                    blockedColor={color}
                />}
            </div>
            {/* current player */}
            {currentPlayer && (
                <div className="md:row-start-10 md:col-start-2 md:col-end-11 md:row-span-2 col-span-12 w-full h-full p-1">
                    <div className="grid grid-cols-7 w-full h-full items-center justify-center md:relative">
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
                                <button key={figure.id_figure} className="w-full h-full" >
                                    <Card
                                        type={true}
                                        index={parseInt(figure.type_figure.split(" ")[1], 10)}
                                        id={`figure-${index_id}`}
                                        idCard={figure.id_figure}
                                        selectedCard={selectedCard}
                                        setSelectedCard={setSelectedCard}
                                        isSelectable={selectedTurn === currentPlayer.turn}
                                        setMoveCard={() => { }}
                                        setFigCard={setFigCard}
                                        setFigCardId={setFigCardId}
                                        setMovCardId={() => { }}
                                        usedCard={false}
                                        blockedCard={blockedCards.includes(figure.id_figure)} />
                                </button>
                            ))}
                            {movementCards.map((movement: MoveCard, index_id) => (
                                <button key={movement.id_movement} className="w-full h-full">
                                    <Card
                                        type={false}
                                        index={parseInt(movement.type_movement.split(" ")[1], 10)}
                                        id={`movement-${index_id}`}
                                        idCard={movement.id_movement}
                                        selectedCard={selectedCard}
                                        setSelectedCard={setSelectedCard}
                                        isSelectable={selectedTurn === currentPlayer.turn}
                                        setMoveCard={setMoveCard}
                                        setFigCard={() => { }}
                                        setFigCardId={() => { }}
                                        setMovCardId={setMovCardId}
                                        usedCard={usedCards.includes(movement.id_movement)}
                                        blockedCard={false} />
                                </button>
                            ))}
                        </div>
                        <div className=" grid col-start-13 md:bottom-0 md:right-0 md:top-auto md:left-auto ">
                            <div className="w-8 h-11 border-2 border-gray-700 dark:border-gray-100 rounded-md flex items-center justify-center">
                                <p className="text-gray-700 dark:text-gray-100 font-bold text-lg">{figDeck.find(deck => deck.player_id === id_player)?.deck || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isChatOpen && (
                <div className="fixed w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
                    <ChatComponent messages={messages} addMessages={addMessage} />
                    <button 
                        className="absolute top-4 right-4 bg-red-500 text-white py-1 px-4 rounded" 
                        onClick={() => setIsChatOpen(false)}
                    >
                        Cerrar Chat
                    </button>
                </div>
            )}
            {/* rivales */}
            {rivales.map((player: Player, index) => {
                return (
                    <div key={player.id + index} className={clsx(
                        "col-span-12 w-full h-full p-1 md:relative",
                        {
                            "md:row-start-2 md:row-span-2 md:col-start-4": index === 0,
                            "md:row-start-4 md:row-span-4  md:col-span-4": index === 1,
                            "md:row-start-4 md:col-start-9 md:row-span-4  md:col-span-4": index === 2,
                        }
                    )}>
                        <div className={clsx(
                            "grid grid-cols-7 w-full h-full items-center justify-center ",
                            {
                                "md:grid-rows-2": index === 0,
                                "md:grid-cols-4 md:grid-rows-3": index === 1 || index === 2,
                            }

                        )}>
                            <div className={clsx("font-bold w-fit p-1  md:flex md:justify-center md:text-xl md:text-center md:items-center  ",
                                {
                                    "bg-black text-white rounded dark:bg-white dark:text-black": selectedTurn === player.turn,
                                })}>{player.username}</div>
                            <div className={clsx(
                                "col-span-6 grid grid-cols-6 w-full h-full gap-1",
                                {
                                    "md:row-span-2 md:col-span-5": index === 0,
                                    "md:row-span-4 md:grid-cols-3 md:col-span-5": index === 1 || index === 2,
                                }

                            )}>
                                {figureCards.filter(card => card.player_id === player.id).map((figure: FigureCard, index_id) => (
                                    <button key={figure.id_figure} className="w-full h-full" >
                                        <Card
                                            type={true}
                                            index={parseInt(figure.type_figure.split(" ")[1], 10)}
                                            id={`rival-${index}-figure-${index_id}`}
                                            idCard={figure.id_figure}
                                            selectedCard={selectedCard}
                                            setSelectedCard={setSelectedCard}
                                            isSelectable={selectedTurn === playerTurn}
                                            setMoveCard={() => { }}
                                            setFigCard={setFigCard}
                                            setFigCardId={setFigCardId}
                                            setMovCardId={() => { }}
                                            usedCard={false}
                                            blockedCard={blockedCards.includes(figure.id_figure)} />
                                    </button>
                                ))}
                            </div>
                            <div className={clsx("grid col-start-11 md:text-lg md:grid md:overflow-hidden md:items-center ",
                                {
                                    "md:absolute md:bottom-0 ": index === 0,
                                    "md:col-start-3": index === 1 || index === 2,
                                })}>
                                <div className="w-8 h-10 border-2 border-gray-700 dark:border-gray-100 rounded-md flex items-center justify-center">
                                    <p className="text-gray-700 dark:text-gray-100 font-bold text-lg">{figDeck.find(deck => deck.player_id === player.id)?.deck || 0}</p>
                                </div>
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
                        id="end-turn-button"
                        onClick={async () => {
                            if (id_player !== null) {
                                const resp = await end_turn(id_player);
                                if (resp === 'Turno finalizado') {
                                    setHasMovement(false);
                                    setUsedCards([]);
                                } else {
                                    alert(resp);
                                }
                            }
                        }}>terminar turno</button>
                    {(hasMovement && (playerTurn === selectedTurn)) &&
                        <button
                            className="md:justify-start p-1 border-2 text-white rounded bg-slate-700 hover:hover:bg-gray-700/95 dark:rounded-none dark:bg-inherit dark:hover:bg-gray-600 disabled:hover:dark:bg-inherit disabled:opacity-50"
                            onClick={async () => {
                                if (id_game !== null && id_player !== null) {
                                    const resp = await revert_movements({ game_id: id_game, player_id: id_player });
                                    if (resp === "Movimientos revertidos") setHasMovement(false), setUsedCards([]);
                                }
                            }}>Revertir movimeintos</button>}
                    <button
                        onClick={async () => {
                            if (id_player !== null) {
                                if (playerTurn === selectedTurn && players.length > 2) {
                                    await end_turn(id_player);
                                }
                                await leave_game({ player_id: id_player })
                                const new_players = players.filter(player => player.id !== id_player)
                                setPlayers(new_players)
                            }
                        }}
                        className={`md:justify-end p-1 border-2 text-white rounded bg-slate-700 hover:hover:bg-gray-700/95 dark:rounded-none dark:bg-inherit dark:hover:bg-gray-600 ${playerTurn !== selectedTurn ? "col-span-2" : ""}`}>abandonar partida</button>
                </>}
            </div>
        </div>
    );
}

export default Game;