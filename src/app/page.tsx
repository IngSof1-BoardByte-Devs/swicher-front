"use client"
import { CreateGameForm, UserForm } from "@/components/form";
import { fetch_games } from "@/lib/game";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function Home() {
  const [createGame, setCreateGame] = useState(false);
  const [joinGame, setJoinGame] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch_games().then((data) => {
      setGames(data);
    })
  }, []);

  const devs = ["Ramiro cuellar", "Juan Quintero", "Juan Mazzaforte", "Daniela Courel", "Aaron Lihuel", "Franco Bustos"];
  return (
    <div className="w-full h-dvh grid grid-rows-6 grid-flow-dense">
      <div className="row-span-1">
        <main className="flex items-center justify-center w-full h-full">
          <h1 className="text-4xl text-center uppercase font-semibold">boardbyte devs switcher</h1>
        </main>
      </div>
      <div className="row-span-4 p-4">
        <div className="flex justify-between">
          <div>{"Nombre de partidas"}</div>
          <div>{"Cantidad de jugadores"}</div>
        </div>
        <div className="w-full border overflow-auto shadow">
          <div className="flex flex-col divide-y-2">
            {games.length === 0 && <div className="text-center p-2">No hay partidas disponibles</div>}
            {games.map(({ id, name, num_players }) => {
              return (
                <button key={id} className={clsx("p-4", {
                  "bg-gray-700 text-white": selected === id
                })} onClick={() => { setSelected(id) }}>
                  <div className="flex justify-between">
                    <div>{name}</div>
                    <div>{num_players}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      {/* buttons */}
      <div className="row-span-1 p-2">
        <div className="flex gap-1 justify-center">
          <button className="border shadow rounded p-2 bg-slate-700 text-white capitalize" onClick={() => setCreateGame(true)}>Crear partida</button>
          <button className="border shadow rounded p-2 bg-slate-700 text-white capitalize disabled:opacity-50" disabled={selected == -1} onClick={() => setJoinGame(true)}>unirse partida</button>
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
      { /* create game form*/}
      {createGame &&
        <div className={clsx("absolute bg-slate-700/75 w-full h-dvh z-10 backdrop-blur flex justify-center items-center", {
        })}>
          <div className="border relative w-fit h-fit bg-white rounded">
            <CreateGameForm />
            <button className="absolute top-0 right-0 w-7 h-7" onClick={() => setCreateGame(false)}>x</button>
          </div>
        </div>
      }
      { /* join game form*/}
      {joinGame &&
        <div className={clsx("absolute bg-slate-700/75 w-full h-dvh z-10 backdrop-blur flex justify-center items-center", {
        })}>
          <div className="border relative w-fit h-fit bg-white rounded">
            <UserForm gameId={selected} />
            <button className="absolute top-0 right-0 w-7 h-7" onClick={() => setJoinGame(false)}>x</button>
          </div>
        </div>
      }
    </div>
  );
}
