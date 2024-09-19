import { fetch_board } from "@/lib/board";
import fetchMock from 'jest-fetch-mock';

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