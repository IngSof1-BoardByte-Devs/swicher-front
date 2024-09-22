export function Winner({ player_name }: { player_name: string }) {
    return (
      <div className="fixed inset-0 w-full h-screen flex justify-center items-center bg-black bg-opacity-55 backdrop-blur-sm ">
        <div className="border border-gray-600 dark:border-gray-400 p-8 rounded-xl shadow-lg flex flex-col items-center gap-3 max-w-md w-full bg-gray-800">
          <div className="text-xl font-semibold text-gray-400">Ganador</div>
          <div className="text-4xl text-center text-white w-full uppercase italic  font-bold p-3 rounded-md bg-gray-700">
            {player_name}
          </div>
        </div>
      </div>
    );
  }
