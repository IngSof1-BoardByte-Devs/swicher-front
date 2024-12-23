import { fetch_board } from "@/lib/board";
import Gameboard from "@/components/gameboard";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import { useGameInfo } from "@/app/contexts/GameInfoContext";
import { Piece } from "@/components/piece";

global.fetch = jest.fn();
fetchMock.enableMocks();

// Mocks de dependencias externas
jest.mock('@/lib/board', () => ({
  fetch_board: jest.fn().mockResolvedValue({
    board: Array(36).fill({ color: 1 }), // Un tablero de 6x6 con un color fijo.
  }),
}));
 jest.mock("@/app/contexts/GameInfoContext", () => ({
   useGameInfo: jest.fn(),
 }));
 jest.mock("@/components/piece", () => ({
   Piece: jest.fn(({ color, index }) => (
     <div data-testid={`piece-${index}`} style={{ backgroundColor: color }}></div>
   )),
 }));
 
 describe("Gameboard Component", () => {
   const defaultProps = {
     selectedTurn: 1,
     playerTurn: 1,
     moveCard: "mov1",
     callUseMoveCard: jest.fn(),
     figCard: "fig1",
     figCardId: 1,
     movCardId: 1,
     callUseFigCard: jest.fn(),
     socketDataMove: null,
     setSocketDataMove: jest.fn(),
     socketDataCancel: null,
     setSocketDataCancel: jest.fn(),
     socketDataFigure: null,
     setSocketDataFigure: jest.fn(),
   };
 
   beforeEach(() => {
     // Configura el contexto del juego
     (useGameInfo as jest.Mock).mockReturnValue({ id_game: 1, id_player: 1 });
     (fetch_board as jest.Mock).mockResolvedValue({ board: [{ color: "red" }, { color: "blue" }] });
   });
 
   afterEach(() => {
     jest.clearAllMocks();
   });
 
   test("should render Gameboard with pieces", async () => {
     await act(async () => render(<Gameboard {...defaultProps} />));
     expect(screen.getByRole("grid")).toBeInTheDocument();
     expect(screen.getByTestId("piece-0")).toBeInTheDocument();
     expect(screen.getByTestId("piece-1")).toBeInTheDocument();
   });
 
   test("should call fetch_board on mount and setFigures", async () => {
     await act(async () => render(<Gameboard {...defaultProps} />));
     expect(fetch_board).toHaveBeenCalledWith({ id_game: 1 });
   });
 });
 