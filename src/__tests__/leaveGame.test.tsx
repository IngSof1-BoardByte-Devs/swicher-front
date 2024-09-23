import { LeaveGame } from '@/lib/quit';

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
          json: async () => ({ status: 'OK', message: 'Leave the game successfully' }),
        });
    
        const successResult = await LeaveGame({ player_id: 1, game_id: 1 });
    
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/leave-game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ player_id : 1 , game_id: 1 }),
        });
    
        expect(successResult).toEqual({ status: 'OK', message: 'Leave the game successfully' });
    
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500,
        });
    
        const failResult = await LeaveGame({ player_id: 1, game_id: 1 });
    
        expect(failResult).toEqual({ status: 'ERROR', message: 'An error occurred while living the game' });
      });
});
