"use client";
import React, { useEffect, useState } from "react";
import { start_game, fetch_game } from "@/lib/game";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@app/contexts/WebSocketContext";
import { useGameInfo } from "@app/contexts/GameInfoContext";

export default function LobbyPage() {
  const [error, setError] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameName, setGameName] = useState("");
  const { socket } = useWebSocket();
  const router = useRouter()
  const { id_game, id_player } = useGameInfo();

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
        if (socketData.event === "join_game") {
          setPlayers((players) => [...players, {
            id: socketData.data.player_id,
            username: socketData.data.player_name,
            turn: 0
          } as Player]);
        } else if (socketData.event === "start_game") {
          router.push("/game/");
        }
      };
    }
  }, [socket, router]);

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
        <button
          onClick={handleStartGame}
          type="button"
          className="border dark:rounded-none shadow rounded p-2 dark:bg-inherit dark:hover:bg-gray-600 bg-slate-700 hover:hover:bg-gray-700/95 text-white capitalize"
        >
          Comenzar Partida
        </button>
      </div>
    </div>
  );
}
