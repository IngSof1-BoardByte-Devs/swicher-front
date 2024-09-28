"use client";
import React, { useState } from "react";
import { join_game, create_game } from "@/lib/game";
import { useRouter } from "next/navigation";

export function UserForm({gameId}:{gameId:number}) {
  const [playerName, setPlayerName] = useState<string>("");
  const [error, setError] = useState<string>("");
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
      router.push(`/game/`);
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
          className="w-full border-2 text-white p-2 rounded bg-gray-900 hover:bg-gray-700 transition"
        >
          Unirse a la Partida
        </button>
      </form>
    </div>
  );
};

export function CreateGameForm() {

    const [formData, setFormData] = useState({ player_name: '', game_name: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    const create = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.game_name === '' || formData.player_name === '') {
            setErrorMessage('Todos los campos son obligatorios');
            return;
        }

        if (
            !alphanumericRegex.test(formData.game_name) ||
            !alphanumericRegex.test(formData.player_name)) {
            setErrorMessage("Solo se permiten caracteres alfanuméricos");
            return;
        } else {
            setErrorMessage('');
            send(formData);
        }
    }
    const send = async (data: { player_name: string; game_name: string; }) => {
        const result = await create_game({
            player_name: formData.player_name, game_name: formData.game_name
        });
        if (result.status === "ERROR") 
            setErrorMessage(result.message);
        else 
            router.push(`/game/`);
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

                <label htmlFor='game_name' className="block dark:text-white mb-2">
                    Nombre de la partida
                </label>
                <input
                    //className='rounded border-2  border-black text-black dark:bg-slate-300 w-1/3 sm:w-auto'
                    className="w-full p-2 border border-gray-900 text-black dark:bg-black dark:text-white dark:border-gray-300 rounded"
                    
                    type="text"
                    id="game_name"
                    value={formData.game_name}
                    onChange={(e) => setFormData({ ...formData, game_name: e.target.value })}

                    autoComplete='off'
                />

                {errorMessage && <p className="text-red-500 max-w-full text-sm">{errorMessage}</p>}

                <button type="submit" className='w-full border-2 text-white p-2 rounded bg-gray-900 hover:bg-gray-700'>
                    Crear partida
                </button>
            </div>
        </form>
    );
}
