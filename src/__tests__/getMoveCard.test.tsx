import { GetMoveCard } from "@/lib/getMoveCard"
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("GetMoveCard", () => {
    beforeEach(() =>{
        fetchMock.resetMocks();
    });
    test('url should be correct', async () => {
        const result = await GetMoveCard({ player_id: 1 });
        console.log(result);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/movement-cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player_id: 1 }),
        });
    });

    test('should return success when the fetch request is successful', async () => {
        const mockResponse = { status: 'OK', message: 'Movement cards fetched successfully' };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const result = await GetMoveCard({ player_id: 1 });
        expect(result).toEqual(mockResponse);
    });

    test('should return error when the fetch request fails', async () => {
        const mockResponse = { status: 'ERROR', message: 'An error occurred while getting the movement cards' };
        fetchMock.mockRejectOnce(new Error('Network error'));
        const result = await GetMoveCard({ player_id: 1 });
        expect(result).toEqual(mockResponse);
    });
});