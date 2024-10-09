import { fetch_board } from "@/lib/board";
import Gameboard from "@/components/gameboard";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'; 
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks(); 

const id_game = 1;

describe('fetch_board', () => {
    beforeEach(() => {
        fetchMock.resetMocks();  
    });

    test('url should be correct', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ board: [] })); 

        const result = await fetch_board({ id_game });
        expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/games/${id_game}/board`);
    });

    test('should return success when the fetch request is successful', async () => {
        const mockResponse = { board: Array(36).fill({ color: 1 }) };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse));  

        const result = await fetch_board({ id_game });
        expect(result).toEqual(mockResponse);
    });
});

describe("Gameboard Component", () => {
    beforeEach(() => {
        fetchMock.resetMocks();  
    });

    test("renders correctly", async () => {
        const mockBoardResponse = {
            board: Array(36).fill({ color: 1 })  
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockBoardResponse));  

        render(<Gameboard id_game={id_game} />);
        const gameboardElement = await screen.findByRole('grid');
        expect(gameboardElement).toBeInTheDocument();
    });

    test("renders 36 pieces", async () => {
        const mockBoardResponse = {
            board: Array(36).fill({ color: 1 })  
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockBoardResponse));  

        render(<Gameboard id_game={id_game} />);
        const pieces = await screen.findAllByRole("img");
        expect(pieces).toHaveLength(36);
    });
});
