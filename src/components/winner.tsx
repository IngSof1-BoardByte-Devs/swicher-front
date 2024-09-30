import { useRouter } from "next/navigation";
import { useWebSocket } from "@/app/contexts/WebSocketContext";
import { useEffect, useRef } from "react";
import { useGameInfo } from "@/app/contexts/GameInfoContext";

export function Winner({ player_name }: { player_name: string }) {
  const { id_game, setIdGame, setIdPlayer } = useGameInfo();
  const socketGameLeave = useRef(false);
  const router = useRouter()
  const { socket } = useWebSocket();

  useEffect(() => {
    if (socket && !socketGameLeave.current) {
      socket?.send("/leave " + id_game);
      setIdGame(null);
      setIdPlayer(null);
      socketGameLeave.current = true;
    }
  });

return (
  <button className="fixed inset-0 w-full h-screen flex justify-center items-center bg-black bg-opacity-55 backdrop-blur-sm" onClick={() => {
    router.push("/")
  }
  }>
    <div className="border border-gray-600 dark:border-gray-400 p-8 rounded-xl shadow-lg flex flex-col items-center gap-3 max-w-md w-full bg-gray-800">
      <div className="text-xl font-semibold text-gray-400">Ganador</div>
      <div className="text-4xl text-center text-white w-full uppercase italic  font-bold p-3 rounded-md bg-gray-700">
        {player_name}
      </div>
    </div>
  </button>
);
}
