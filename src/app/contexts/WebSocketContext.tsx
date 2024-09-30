"use client"
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
interface WebSocketContextType {
    socket: WebSocket | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (!socketRef.current) {
            const newSocket = new WebSocket("ws://localhost:8000/ws");

            newSocket.onerror = () => {
                console.log("WebSocket error");
            };

            newSocket.onopen = () => {
                console.log("WebSocket connection opened");
            };

            newSocket.onclose = () => {
                console.log("WebSocket connection closed");
            };

            socketRef.current = newSocket;
            setSocket(newSocket);
        }

    }, []);

    return (
        <WebSocketContext.Provider value={{ socket }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};