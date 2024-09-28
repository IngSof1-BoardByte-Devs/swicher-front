"use client";
import React, { useEffect, useState } from "react";
import { List } from "@/components/list";
import { start_game, fetch_players } from "@/lib/game";
import { useCookies } from "react-cookie";
import clsx from "clsx";

export default function LobbyPage() {
  const [error, setError] = useState<string>("");
  const [cookie, setCookie] = useCookies(["player_id", "game_id", "game_name"]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch_players({player_id : cookie.player_id}).then((data) => {setPlayers(data)});
  });

  const handleStartGame = async () => {
    const result = await start_game({
      player_id: cookie.player_id,
      game_id: cookie.game_id
  });

    if (result.status === "ERROR") {
      setError(result.message);
    }
    console.log(result.message);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold uppercase">{cookie.game_name}</h1>
        <h1 className="text-lg font-semibold">LOBBY</h1>
      </div>
      <div className="w-full border overflow-auto">
        <div className="flex-col flex divide-y-2">
          {players.map((player_id) => {
            return (
              <button
                key={player_id}
                className="p-4 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-default"
              >
                <div className="flex justify-center">
                  <div>{player_id}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center mt-12 w-full">
        <button
          onClick={handleStartGame}
          type="button"
          className="border dark:rounded-none shadow rounded p-2 dark:bg-inherit dark:hover:bg-gray-600 bg-slate-700 hover:hover:bg-gray-700/95 text-white capitalize"
        >
          Comenzar Partida
        </button>
        {error && (
          <p className="text-red-500 max-w-full text-sm text-center mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
