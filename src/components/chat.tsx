import { useGameInfo } from "@/app/contexts/GameInfoContext";
import { useWebSocket } from "@/app/contexts/WebSocketContext";
import { useEffect, useState } from "react";

export default function ChatComponent() {
    const [messages, setMessages] = useState<string[]>([]);
    const { id_player } = useGameInfo();
    const { socket } = useWebSocket();

    useEffect(() => {
        if (socket) {
            const handleMessage = (event: MessageEvent) => {
                const socketData = JSON.parse(event.data);
                const command = socketData.event.split(".");
                if (command[0] === "message" && command[1] === "chat") {
                    const newMessage = socketData.payload.username + ": " + socketData.payload.message;
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                }
            };

            socket.addEventListener("message", handleMessage);

            // Clean up the event listener when the component unmounts or socket changes
            return () => {
                socket.removeEventListener("message", handleMessage);
            };
        }
    }, [socket]);

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
    }

    return (
        <div className="w-full border">
            <h1 className="w-full bg-slate-100 p-2 uppercase font-bold text-center">Chat</h1>
            <section>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index} className="p-2">{message}</li>
                    ))}
                </ul>
            </section>
            <form className="p-2 flex justify-around" onSubmit={handlesubmit}>
                <input className="border rounded-full py-2 px-3" type="text" placeholder="Escribe tu mensaje" />
                <button className="border rounded-full py-2 px-3">Enviar</button>
            </form>
        </div>
    )
}