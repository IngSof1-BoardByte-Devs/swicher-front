import { end_turn } from '@/lib/board';

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
        const player_id = 1;
        const successResult = await end_turn(player_id);
    
        expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/players/${player_id}/turn`, {
          method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ player_id })
        });
    
        expect(successResult).toEqual({ status: 'OK', message: 'End turn successfully' });
    
        fetchMock.mockRejectedValueOnce(new Error('An error occurred while ending the turn'));
        
        const failResult = await end_turn(1);
    
        expect(failResult).toEqual({ status: 'ERROR', message: 'An error occurred while ending the turn' });
      });
});
