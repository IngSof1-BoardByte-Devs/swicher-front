import Gameboard from "@/components/gameboard";
import { fetch_board } from "@/lib/board";
import { render, screen } from "@testing-library/react";
import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom'; 

fetchMock.enableMocks();

const id_game = 1;

describe('fetch_board', () => {
    beforeEach(() => {
        fetchMock.mockClear();
    });

    test('url should be correct', async () => {
        const result = await fetch_board({ id_game });
        console.log(result);
        expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/games/${id_game}/board`);
    });

    test('should return success when the fetch request is successful', async () => {
        const mockResponse = { status: 'OK', message: 'Board fetched successfully' };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const result = await fetch_board({ id_game });
        expect(result).toEqual(mockResponse);
    });
});

describe("GameBoard Component", () => {
    test("renders correctly", () => {
        render(<Gameboard id_game={id_game}/>);
        const gameboardElement = screen.getByRole('grid');
        expect(gameboardElement).toBeInTheDocument();
    });

    test("renders 36 pieces", () => {
        render(<Gameboard id_game={id_game}/>);
        const pieces = screen.getByRole("img");
        expect(pieces).toHaveLength(36);
    });
});
