import { EndTurn } from "@/lib/endTurn";

import fetchMock from 'jest-fetch-mock';

global.fetch = jest.fn();
fetchMock.enableMocks();
describe('end turn function', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
      });

      it('should handle both a successful 200 response and a failure', async () => {

        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 'OK', message: 'End turn successfully' }),
        });
    
        const successResult = await EndTurn(1);
    
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/end-turn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ player_id : 1 }),
        });
    
        expect(successResult).toEqual({ status: 'OK', message: 'End turn successfully' });
    
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500,
        });
    
        const failResult = await EndTurn(1);
    
        expect(failResult).toEqual({ status: 'ERROR', message: 'An error occurred while ending the turn' });
      });
});
