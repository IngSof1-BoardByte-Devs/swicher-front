import { leave_game } from '@/lib/game';

import fetchMock from 'jest-fetch-mock';

global.fetch = jest.fn();
fetchMock.enableMocks();
describe('Leave game function', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    it('should handle both a successful 200 response and a failure', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                status: 'OK',
                message: 'Leave the game successfully',
            }),
        });
        const player_id = 1;
        const successResult = await leave_game({ player_id });

        expect(fetch).toHaveBeenCalledWith(
            `http://localhost:8000/players/${player_id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        expect(successResult).toEqual({
            status: 'OK',
            message: 'Leave the game successfully',
        });

        fetchMock.mockRejectedValueOnce(
            new Error('An error occurred while living the game'),
        );

        const failResult = await leave_game({ player_id: 1 });

        expect(failResult).toEqual({
            status: 'ERROR',
            message: 'An error occurred while living the game',
        });
    });
});
