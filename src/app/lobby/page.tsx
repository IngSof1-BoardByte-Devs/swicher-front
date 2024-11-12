"use client";
import { useEffect, useState } from "react";
import { start_game, fetch_game, leave_game } from "@/lib/game";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@app/contexts/WebSocketContext";
import { useGameInfo } from "@app/contexts/GameInfoContext";

export default function LobbyPage() {
  const [error, setError] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameName, setGameName] = useState("");
  
  const { socket } = useWebSocket();
  const { id_game, id_player } = useGameInfo();
  
  const router = useRouter()

  interface Player {
    id: number;
    username: string;
    turn: number;
  }

  useEffect(() => {
    const fetchGame = async () => {
      try {
        if (id_game == null) return;
        const data = await fetch_game({ game_id: id_game });
        setPlayers(data.players);
        setGameName(data.name);
      } catch (err) {
        console.error("Failed to fetch players:", err);
      }
    };

    fetchGame();
  }, [id_game]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const socketData = JSON.parse(event.data);
        const command = socketData.event.split(".");
        if (command[0] === "game") {                  // game commands
          if (command[1] === "start"){                // start game
            router.push("/game/");
          } else if (command[1] === "cancelled" && id_game === socketData.payload.game_id) {    // canceled game
            router.push("/");
          }
        } else if (command[0] === "player") {         // player commands
          if (command[1] === "new") {                  // new player
            const new_player : Player = {
              id: players[players.length - 1].id + 1,
              username: socketData.payload.username,
              turn: 0,
            };
            setPlayers(players => [...players, new_player]);
          } else if (command[1] === "left") {          // player left
            setPlayers(players => players.filter(player => player.username !== socketData.payload.username));
          }
        }else if (command[0]==="figure") {
        } else {
          
          throw new Error("Se recibio un comando invalido");
        }
      };
    }
  }, [socket, router, players]);

  const handleStartGame = async () => {
    if (players.length < 2) {
      setError("Deben haber 2 o mas jugadores para iniciar partida")
      return
    }
    if (id_player == null) return;
    await start_game({
      player_id: id_player,
    }).then((result) => {
      if (result.status === "ERROR") {
        setError(result.message);
      } else {
        router.push("/game/")
      }
    });
  };

  const handleLeaveGame = async () => {
    if (id_player == null) {
      alert("El jugador no existe");
      return
    };
    const response = await leave_game({player_id: id_player})
    if (response.status === "OK") {
      alert("Has abandonado la partida");
      router.push("/");
    } else if (response.message === "Error al salir del juego") {
      alert("Error al salir del juego");
    } else {
      alert("Error inesperado");
    }
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold uppercase">{gameName}</h1>
        <h1 className="text-lg font-bold uppercase">{"LOBBY"}</h1>
      </div>
      <div className="w-full border overflow-auto">
        <div className="flex-col flex divide-y-2">
          {players.map(({ username }, index) => {
            return (
              <button
                key={username + index}
                className="p-4 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-default"
              >
                <div className="flex justify-center">
                  <div>{username}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center mt-12">
        {error && (
          <p className="text-red-500 max-w-full text-sm text-center mt-2">
            {error}
          </p>
        )}
        { id_player === players[0]?.id &&
          <button
          onClick={handleStartGame}
          type="button"
          className="border dark:rounded-none shadow rounded p-2 dark:bg-inherit dark:hover:bg-gray-600 bg-slate-700 hover:hover:bg-gray-700/95 text-white capitalize"
          >
          Comenzar Partida
        </button>
        }
        <button
          onClick={handleLeaveGame}
          type="button"
          className="border dark:rounded-none shadow rounded p-2 dark:bg-inherit dark:hover:bg-gray-600 bg-slate-700 hover:hover:bg-gray-700/95 text-white capitalize"
          >
          Abandonar partida
        </button>
      </div>
    </div>
  );
}
