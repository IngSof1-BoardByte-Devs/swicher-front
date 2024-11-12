"use client";
import React, { useState } from "react";
import { join_game, create_game } from "@/lib/game";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/app/contexts/WebSocketContext";
import { useGameInfo } from "@/app/contexts/GameInfoContext";

export function UserForm({ gameId }: { gameId: number }) {
  const { setIdGame, setIdPlayer } = useGameInfo();
  const [playerName, setPlayerName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { socket } = useWebSocket();

  const router = useRouter();

  const alphanumericRegex = /^[a-zA-Z0-9]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName) {
      setError("Completar todos los campos");
      return;
    }

    if (!alphanumericRegex.test(playerName) || (password !== '' && !alphanumericRegex.test(password))) {
      setError("Solo se permiten caracteres alfanuméricos");
      return;
    }

    setError("");

    const result = await join_game({
      player_name: playerName,
      game_id: gameId,
      password: password,
    });

    if (result.status === "ERROR") {
      setError(result.message);
    } else {
      setIdPlayer(result.player_id);
      setIdGame(gameId);
      socket?.send("/join " + gameId);
      router.push(`/lobby/`);
    }
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
          maxLength={8}
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full p-2 border border-gray-900 dark:bg-black dark:text-white dark:border-gray-300 rounded"
        />
        <label htmlFor="password" className="block">
          Contraseña
        </label>
        <input
          data-testid="password"
          type="password"
          maxLength={10}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
  const { setIdGame, setIdPlayer } = useGameInfo();
  const [formData, setFormData] = useState({ player_name: '', gameName: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const router = useRouter();
  const { socket } = useWebSocket();

  const alphanumericRegex = /^[a-zA-Z0-9]+$/;

  const create = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.gameName === '' || formData.player_name === '' || (isPrivate && !formData.password)) {
      setErrorMessage('Todos los campos deben ser completados');
      return;
    }

    if (
      !alphanumericRegex.test(formData.gameName) ||
      !alphanumericRegex.test(formData.player_name) ||
      (isPrivate && formData.password && !alphanumericRegex.test(formData.password))
    ) {
      setErrorMessage("Solo se permiten caracteres alfanuméricos");
      return;
    } else {
      setErrorMessage('');
      send({
        player_name: formData.player_name,
        game_name: formData.gameName,
        password: isPrivate ? formData.password : "",
      });
    }
  };

  const send = async ({ player_name, game_name, password }: { player_name: string, game_name: string, password: string }) => {
    await create_game({
      player_name,
      game_name,
      password,
    }).then((res) => {
      if (res.status === "ERROR") {
        setErrorMessage(res.message);
      } else {
        setIdPlayer(res.player_id);
        setIdGame(res.game_id);
        socket?.send("/join " + res.game_id);
        router.push(`/lobby/`);
      }
    });
  };

  return (
    <form onSubmit={create} className="w-full flex justify-center items-center">
      <div className="border-solid flex justify-center flex-col items-center border-white p-6 rounded-lg gap-2 max-w-sm w-full overflow-hidden">
        <div className="text-2xl font-bold">Crear partida</div>

        <label htmlFor="player_name" className="block dark:text-white mb-2">
          Nombre de usuario
        </label>
        <input
          className="w-full p-2 border border-gray-900 text-black dark:bg-black dark:text-white dark:border-gray-300 rounded"
          type="text"
          maxLength={8}
          id="player_name"
          name="player_name"
          value={formData.player_name}
          onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
          autoComplete="off"
        />

        <label htmlFor="gameName" className="block dark:text-white mb-2">
          Nombre de la partida
        </label>
        <input
          className="w-full p-2 border border-gray-900 text-black dark:bg-black dark:text-white dark:border-gray-300 rounded"
          type="text"
          maxLength={10}
          id="gameName"
          value={formData.gameName}
          onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
          autoComplete="off"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
            id="privateGame"
          />
          <label htmlFor="privateGame">Partida Privada</label>
        </div>

        {isPrivate && (
          <>
            <label htmlFor="password" className="block dark:text-white mb-2">
              Contraseña
            </label>
            <input
              className="w-full p-2 border border-gray-900 text-black dark:bg-black dark:text-white dark:border-gray-300 rounded"
              type="password"
              maxLength={10}
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              autoComplete="off"
            />
          </>
        )}

        {errorMessage && <p className="text-red-500 max-w-full text-sm">{errorMessage}</p>}

        <button type="submit" className="w-full border-2 text-white p-2 rounded bg-slate-700 hover:hover:bg-gray-700/95">
          Crear partida
        </button>
      </div>
    </form>
  );
}
