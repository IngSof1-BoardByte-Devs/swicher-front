"use client";
import React, { useState } from "react";
import { join_game, create_game } from "@/lib/game";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

export function UserForm({ gameId, gameName }: { gameId: number, gameName: string}) {
  const [playerName, setPlayerName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [cookies, setCookie] = useCookies(['player_id', 'game_id', 'game_name']);

  const router = useRouter()


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


    if (result.status === "ERROR")
      setError(result.message);
    else
      setCookie('player_id', 1, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
      setCookie('game_id', gameId, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
      setCookie('game_name', gameName, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
    router.push(`/lobby/`);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="border-solid border-white p-6 rounded-lg flex flex-col items-center gap-2 max-w-sm w-full overflow-hidden"
      >
        <h2 className="text-2xl font-bold">Unirse a la Partida</h2>
        <label htmlFor="playerName" className="block">
          Nombre de Jugador
        </label>
        <input
          data-testid="playerName"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full p-2 border border-gray-900 dark:bg-black dark:text-white dark:border-gray-300 rounded"
        />
        {error && <p className="text-red-500 max-w-full text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full border-2 text-white p-2 rounded bg-slate-700 hover:hover:bg-gray-700/95 transition"
        >
          Unirse a la Partida
        </button>
      </form>
    </div>
  );
};

export function CreateGameForm() {
  const [cookies, setCookie] = useCookies(['player_id', 'game_id', 'game_name']);
  const [formData, setFormData] = useState({ player_name: '', gameName: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const alphanumericRegex = /^[a-zA-Z0-9]+$/;

  const create = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.gameName === '' || formData.player_name === '') {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }

    if (
      !alphanumericRegex.test(formData.gameName) ||
      !alphanumericRegex.test(formData.player_name)) {
      setErrorMessage("Solo se permiten caracteres alfanuméricos");
      return;
    } else {
      setErrorMessage('');
      send({player_name: formData.player_name, game_name: formData.gameName});
    }
  }
  const send = async ({ player_name, game_name}: {player_name: string, game_name: string}) => {
    const result = await create_game({
      player_name, game_name
    });
    if (result.status === "ERROR")
      setErrorMessage(result.message);
    else
      setCookie('player_id', result.player_id, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
      setCookie('game_id', result.game_id, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
      setCookie('game_name', game_name, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) })
      router.push(`/lobby/`);
  }

  return (
    <form onSubmit={create}
      className="w-full flex justify-center items-center ">
      <div className="border-solid flex justify-center flex-col items-center  border-white p-6 rounded-lg  gap-2 max-w-sm w-full overflow-hidden">
        <div className="text-2xl font-bold">Crear partida</div>

        <label htmlFor='player_name' className="block dark:text-white mb-2">
          Nombre de usuario
        </label>
        <input
          //className='rounded border-2  border-black  text-black dark:bg-slate-300 w-1/3 sm:w-auto'
          className="w-full p-2 border border-gray-900 text-black dark:bg-black dark:text-white dark:border-gray-300 rounded"

          type="text"
          id="player_name"
          name="player_name"
          value={formData.player_name}
          onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}

          autoComplete='off'
        />

        <label htmlFor='gameName' className="block dark:text-white mb-2">
          Nombre de la partida
        </label>
        <input
          //className='rounded border-2  border-black text-black dark:bg-slate-300 w-1/3 sm:w-auto'
          className="w-full p-2 border border-gray-900 text-black dark:bg-black dark:text-white dark:border-gray-300 rounded"

          type="text"
          id="gameName"
          value={formData.gameName}
          onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}

          autoComplete='off'
        />

        {errorMessage && <p className="text-red-500 max-w-full text-sm">{errorMessage}</p>}

        <button type="submit" className='w-full border-2 text-white p-2 rounded bg-slate-700 hover:hover:bg-gray-700/95'>
          Crear partida
        </button>
      </div>
    </form>
  );
}
