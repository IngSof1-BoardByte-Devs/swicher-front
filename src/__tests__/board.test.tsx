import Gameboard from "@/components/gameboard";
import { fetch_board } from "@/lib/board";
import { render, screen } from "@testing-library/react";
import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom'; 

fetchMock.enableMocks();

describe('fetch_board', () => {
    beforeEach(() => {
        fetchMock.mockClear();
    });

    test('url should be correct', async () => {
        const result = await fetch_board({ game_id: 1 });
        console.log(result);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/game/board', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ game_id: 1 }),
        });
    });

    test('should return success when the fetch request is successful', async () => {
        const mockResponse = { status: 'OK', message: 'Board fetched successfully' };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const result = await fetch_board({ game_id: 1 });
        expect(result).toEqual(mockResponse);
    });
});

describe("GameBoard Component", () => {
    test("renders correctly", () => {
        render(<Gameboard />);
        const gameboardElement = screen.getByRole('grid');
        expect(gameboardElement).toBeInTheDocument();
    });

    test("renders 36 pieces", () => {
        render(<Gameboard />);
        const pieces = screen.getAllByTestId('pieceElement');
        expect(pieces).toHaveLength(36);
    });
});
