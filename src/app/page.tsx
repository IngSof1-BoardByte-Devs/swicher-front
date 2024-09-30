export default function Home() {
  return (
    <div className="w-full h-dvh grid grid-rows-6 grid-flow-dense">
      <div className="row-span-1">
        <main className="flex items-center justify-center w-full h-full">
          <h1 className="text-4xl text-center uppercase font-semibold">boardbyte devs switcher</h1>
        </main>
      </div>
      <div className="row-span-4 p-4 md:px-52 lg:px-80">
        <div className="flex justify-between">
          <div>{"Nombre de partidas"}</div>
          <div>{"Cantidad de jugadores"}</div>
        </div>
        <div className="w-full max-h-[650px] border overflow-auto shadow">
          <div className="flex flex-col divide-y-2 h-full">
            {games.length === 0 && <div className="text-center p-2 ">No hay partidas disponibles</div>}
            {games.map(({ id, name, num_players }) => {
              return (
                <button key={id} className={clsx("p-4", {
                  "bg-gray-700 text-white dark:bg-gray-200 dark:text-black": selectedId === id,
                  "hover:bg-gray-200 dark:hover:bg-gray-600": selectedId !== id
                })} onClick={() => { setSelectedId(id) }}>
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
