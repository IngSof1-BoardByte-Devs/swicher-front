"use client";
import React, { useEffect, useState } from "react";
import { start_game, fetch_players } from "@/lib/game";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

export default function LobbyPage() {
  const [error, setError] = useState<string>("");
  const [cookie, setCookie] = useCookies(["player_id", "game_id", "game_name"]);
  const [players, setPlayers] = useState([]);

  const router = useRouter()

 
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await fetch_players({ player_id: cookie.player_id });
        setPlayers(data);
      } catch (err) {
        console.error("Failed to fetch players:", err);
        setError("Failed to fetch players");
      }
    };

    fetchPlayers();
  }, [cookie.player_id]);

  const handleStartGame = async () => {
    if(players.length < 2){
      setError("Deben haber 2 o mas jugadores para iniciar partida")
      return
    }

    const result = await start_game({
      game_id: cookie.game_id,
      player_id: cookie.player_id,
    });

    if (result.status === "ERROR") {
      setError(result.message);
    }
    
    router.push("/game/")
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold uppercase">{cookie.game_name}</h1>
        <h1 className="text-lg font-semibold">LOBBY</h1>
      </div>
      <div className="w-full border overflow-auto">
        <div className="flex-col flex divide-y-2">
          {players.map(({ username }) => {
            return (
              <button
                key={username}
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
