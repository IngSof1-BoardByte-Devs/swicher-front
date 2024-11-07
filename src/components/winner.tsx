import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function Winner({ player_name }: { player_name: string }) {
    const socketGameLeave = useRef(false);
    const router = useRouter();

    return (
        <div className="p-10 flex flex-col gap-2">
            <div className="text-xl font-semibold text-gray-600 uppercase text-center">
                Ganador
            </div>
            <div className="text-4xl text-center text-white w-full uppercase italic  font-bold p-3 rounded-md bg-gray-700">
                {player_name}
            </div>
            <button
                className="border rounded-full p-2 hover:bg-white/10"
                onClick={() => {
                    router.push('/');
                }}
            >
                Salir
            </button>
        </div>
    );
}
