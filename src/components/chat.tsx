"use client";
import { useGameInfo } from "@/app/contexts/GameInfoContext";
import clsx from "clsx";

export default function ChatComponent({ messages }: { messages: string[] }) {
    const { id_player } = useGameInfo();

    const handlesubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        await fetch(`http://localhost:8000/chats/${id_player}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: (form[0] as HTMLFormElement).value }),
        });
        (form[0] as HTMLFormElement).value = "";
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full h-96 border rounded-md shadow-md bg-white dark:bg-gray-800">
                <h1 className="w-full p-2 uppercase font-bold text-center">Chat</h1>
                <section className="h-64 overflow-y-auto p-2">
                    <ul>
                        {messages.map((message, index) => {
                            const isActionMessage = message.startsWith("_") && message.endsWith("_");
                            const displayMessage = isActionMessage ? message.slice(1, -1) : message;

                            return (
                                <li
                                    key={index}
                                    className={clsx("p-1", isActionMessage && "text-purple-400 italic")}
                                >
                                    {displayMessage}
                                </li>
                            );
                        })}
                    </ul>
                </section>
                <form className="p-2 flex" onSubmit={handlesubmit}>
                    <input
                        className="flex-grow border rounded-l-full py-2 px-3 dark:text-black"
                        type="text"
                        maxLength={30}
                        placeholder="Escribe tu mensaje"
                    />
                    <button className="border rounded-r-full py-2 px-3">Enviar</button>
                </form>
            </div>
        </div>
    );
}
