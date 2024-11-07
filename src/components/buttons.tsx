'use client';
export function Button({ text, fun }: { text: string; fun: () => void }) {
    return (
        <button
            onClick={fun}
            type="button"
            className="border dark:rounded-none shadow rounded p-2 dark:bg-inherit dark:hover:bg-gray-600 bg-slate-700 hover:hover:bg-gray-700/95 text-white capitalize"
        >
            Abandonar partida
        </button>
    );
}
