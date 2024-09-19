"use client";
import React, { useState } from "react";
import { join_game } from "@/lib/game";

interface UserFormProps {
  gameId: number;
}

const UserForm: React.FC<UserFormProps> = ({ gameId }) => {
  const [playerName, setPlayerName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const alphanumericRegex = /^[a-zA-Z0-9]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName) {
      setError("Completar el campo");
      return;
    }

    if (!alphanumericRegex.test(playerName)) {
      setError("Solo se permiten caracteres alfanuméricos");
      return;
    }

    setError("");

    const result = await join_game({
      player_name: playerName,
      game_id: gameId,
    });

    if (result.status === "ERROR") {
      setError(result.message);
    }
  };

  return (
    <div className="w-full h-dvh flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="border-solid border-white p-6 rounded-lg flex flex-col gap-2 max-w-sm w-full overflow-hidden"
      >
        <h2 className="text-2xl font-bold">Unirse a la Partida</h2>
        <label htmlFor="playerName" className="block">
          Nombre de Jugador
        </label>
        <input
          id="playerName"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full p-2 border dark:bg-black dark:text-white dark:border-gray-300 rounded"
        />
        {error && <p className="text-red-500 max-w-full text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full border-2 text-white p-2 rounded bg-gray-900 hover:bg-gray-700 transition"
        >
          Unirse a la Partida
        </button>
      </form>
    </div>
  );
};

export default UserForm;
