"use client"
import { CreateGameForm, UserForm } from "@/components/form";
import { fetch_games } from "@/lib/game";
import { useEffect, useState } from "react";
import { useWebSocket } from "@app/contexts/WebSocketContext";
import clsx from "clsx";
import { motion, useAnimation } from "framer-motion";

export default function Home() {
  const [createGame, setCreateGame] = useState(false);
  const [joinGame, setJoinGame] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const controls = useAnimation();

  interface Game {
    game_id: number;
    name: string;
    players: number;
  }

  interface ApiResponse {
    id: number;
    name: string;
    num_players: number;
  }

  const [games, setGames] = useState<Game[]>([]);
  const { socket } = useWebSocket();

  useEffect(() => {
    fetch_games().then((response: ApiResponse[]) => {
      setGames(response.map(game => {
        return {
          game_id: game.id,
          name: game.name,
          players: game.num_players,
        };
      }));
    });
  }, []);

  const gameChangePlayers = (game_id: number, type:number) => {
    setGames(games => games.map(game => {
      if (game.game_id === game_id) {
        return { ...game, players: game.players + type };
      }
      return game;
    }));
  }

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const socketData = JSON.parse(event.data);
        const command = socketData.event.split(".");
        if (command[0] === "game"){                                           // game comands
          if (command[1] === "new") {                                         // new game
            setGames(games => [...games, socketData.payload as Game]);
          } else if (command[1] === "canceled" || command[1] === "start") {   // canceled or start game
            setGames(games => games.filter(game => game.game_id !== socketData.payload.game_id));
          }
        } else if (command[0] === "player"){                                  // player commands
          if (command[1] === "new") {                                         // new player
            gameChangePlayers(socketData.payload.game_id, 1);
          } else if (command[1] === "leave") {                                // leave player
            gameChangePlayers(socketData.payload.game_id, -1);
          }
        } else {
          throw new Error("Se recibio un comando invalido");
        }
      };
    }
  }, [socket]);

  const filteredGames = games.filter(game => game.name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    controls.start({
      color: ["#00FF00", "#FF0000", "#800080", "#00FFFF"],
      transition: { repeat: Infinity, duration: 6, ease: "easeInOut" },
    });
  }, [controls]);

  const devs = ["Ramiro cuellar", "Juan Quintero", "Juan Mazzaforte", "Daniela Courel", "Aaron Lihuel", "Franco Bustos"];
  return (
    <div className="w-full h-dvh grid grid-rows-6 grid-flow-dense">
      {/* Title */}
      <motion.div
        className="row-span-1"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <main className="flex items-center justify-center w-full h-full">
          <h1 className="text-4xl text-center uppercase font-semibold">
            boardbyte devs{" "}
            <motion.span animate={controls}>SWITCHER</motion.span>
          </h1>
        </main>
      </motion.div>
      <div className="row-span-4 p-4 md:px-52 lg:px-80">
        <div className="flex justify-between">
          <div>{"Nombre de partidas"}</div>
          <div>{"Cantidad de jugadores"}</div>
        </div>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Buscar partidas..."
          className="w-full p-2 my-2 border rounded text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="w-full max-h-[650px] border overflow-auto shadow">
          <div className="flex flex-col divide-y-2 h-full">
            {filteredGames.length === 0 && <div className="text-center p-2">No hay partidas disponibles</div>}
            {filteredGames.map((game, index) => {
              return (
                <button
                  key={game.game_id + index}
                  className={clsx("p-4", {
                    "bg-gray-700 text-white dark:bg-gray-200 dark:text-black": selectedId === game.game_id,
                    "hover:bg-gray-200 dark:hover:bg-gray-600": selectedId !== game.game_id,
                  })}
                  onClick={() => { setSelectedId(game.game_id) }}>
                  <div className="flex justify-between">
                    <div>{game.name}</div>
                    <div>{game.players}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* buttons */}
      <div className="row-span-1 p-4">
        <div className="flex gap-1 justify-center">
          <button className="border dark:rounded-none shadow rounded p-2 dark:bg-inherit dark:hover:bg-gray-600 bg-slate-700 hover:hover:bg-gray-700/95 text-white capitalize" onClick={() => setCreateGame(true)}>Crear partida</button>
          <button className="border dark:rounded-none shadow rounded p-2 dark:bg-inherit dark:hover:bg-gray-600 bg-slate-700 hover:hover:bg-gray-700/95 text-white capitalize disabled:hover:dark:bg-inherit disabled:opacity-50" disabled={selectedId == -1} onClick={() => setJoinGame(true)}>unirse partida</button>
        </div>
      </div>
      <div className="row-span-1">
        <footer>
          <div className="grid grid-cols-6">
            {devs.map((dev, index) => {
              return (
                <div key={index} className="text-center">{dev}</div>
              );
            })}
          </div>
        </footer>
      </div>
      { /* create game form */}
      {createGame &&
        <div className="absolute bg-slate-700/75 dark:bg-inherit w-full h-dvh z-10 backdrop-blur flex justify-center items-center">
          <div className="border relative w-fit h-fit bg-white dark:bg-black rounded">
            <CreateGameForm />
            <button className="absolute top-0 right-0 w-7 h-7" onClick={() => setCreateGame(false)}>x</button>
          </div>
        </div>
      }
      { /* join game form */}
      {joinGame &&
        <div className="absolute bg-slate-700/75 dark:bg-inherit w-full h-dvh z-10 backdrop-blur flex justify-center items-center">
          <div className="border relative w-fit h-fit bg-white dark:bg-black rounded">
            <UserForm gameId={selectedId} />
            <button className="absolute top-0 right-0 w-7 h-7" onClick={() => setJoinGame(false)}>x</button>
          </div>
        </div>
      }
    </div>
  );
}
