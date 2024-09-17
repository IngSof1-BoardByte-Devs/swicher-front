"use client";
import React, { useState } from "react";
import join_game from "@/lib/game";

const UserForm = () => {
  const [playerName, setPlayerName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const alphanumericRegex = /^[a-zA-Z0-9]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName) {
      setError("Completar el campo");
      return;
    }

    if (
      !alphanumericRegex.test(playerName)
    ) {
      setError("Solo se permiten caracteres alfanuméricos");
      return;
    }

    setError("");

    const result = await join_game({
      player_name: playerName,
    });

    if (result.status === "ERROR") {
      setError(result.message);
    }
  };

  return (
   <div className="w-[30vw]">
      <div className="flex justify-center items-center ">
      <form
        onSubmit={handleSubmit}
        className="border-solid border-white p-6 rounded-lg"
      >
        <div>
         <h2 className="text-2xl font-bold mb-4">Unirse a la Partida</h2>
        </div>
        <div className="mb-4">
          <label htmlFor="playerName" className="block text-white mb-2">
            Nombre de Jugador
          </label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full p-2 border bg-black border-gray-300 rounded"
          />
        </div>
         {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full border-2 text-white p-2 rounded hover:bg-gray-600 transition"
        >
         Unirse a la Partida
        </button>
      </form>
    </div>

   </div>
  );
};

export default UserForm;
