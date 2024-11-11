import { render, screen, waitFor } from "@testing-library/react";
import ChatComponent from "../components/chat";
import "@testing-library/jest-dom";
import { useGameInfo } from "@/app/contexts/GameInfoContext";
import { useWebSocket } from "@/app/contexts/WebSocketContext";

jest.mock("@/app/contexts/GameInfoContext");
jest.mock("@/app/contexts/WebSocketContext");

describe("ChatComponent", () => {
    const mockUseGameInfo = useGameInfo as jest.MockedFunction<typeof useGameInfo>;
    const mockUseWebSocket = useWebSocket as jest.MockedFunction<typeof useWebSocket>;

    beforeEach(() => {
        mockUseGameInfo.mockReturnValue({
            id_player: 1,
            id_game: 1,
            setIdGame: jest.fn(),
            setIdPlayer: jest.fn(),
        });
        mockUseWebSocket.mockReturnValue({ socket: new WebSocket("ws://localhost:8000") });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders chat component", () => {
        render(<ChatComponent />);
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
        expect(screen.getByText("Chat")).toBeInTheDocument();
    });

    test("handles incoming WebSocket messages", async () => {
        render(<ChatComponent />);
        const socket = mockUseWebSocket().socket;

        // Simulate a WebSocket message event
        const messageEvent = new MessageEvent("message", {
            data: JSON.stringify({
                event: "message.chat",
                payload: {
                    username: "testuser",
                    message: "Hello, world!"
                }
            })
        });
        if (socket) {
            socket.dispatchEvent(messageEvent);
        }

        // Wait for the message to be added to the chat
        await waitFor(() => {
            expect(screen.getByText("testuser: Hello, world!")).toBeInTheDocument();
        });
    });
});