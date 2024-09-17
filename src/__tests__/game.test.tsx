import { create_game, fetch_games } from '@/lib/game';

global.fetch = jest.fn();

describe('create_game function', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should handle both a successful 200 response and a failure', async () => {

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'OK', message: 'Game created successfully' }),
    });

    const successResult = await create_game({ game_name: 'Test Game', player_name: 'John' });

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/create_game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_name: 'Test Game', player_name: 'John' }),
    });

    expect(successResult).toEqual({ status: 'OK', message: 'Game created successfully' });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const failResult = await create_game({ game_name: 'Test Game', player_name: 'John' });

    expect(failResult).toEqual({ status: 'ERROR', message: 'An error occurred while creating the game' });
  });
});

describe('fetch_games function', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });
  it('should handle both a successful 200 response and a failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'OK', message: 'Game created successfully',
        games: [
          {
            game_id: '1',
            game_name: 'Test Game 1',
            num_players: 1,
          },
          {
            game_id: '2',
            game_name: 'Test Game 2',
            num_players: 2,
          },
        ],
      }),
    });
    const successResult = await fetch_games();
    expect(successResult.games).toHaveLength(2);
    expect(successResult.games[0].game_name).toEqual('Test Game 1');
    expect(successResult.games[1].game_name).toEqual('Test Game 2');
    expect(successResult.games[0].num_players).toEqual(1);
    expect(successResult.games[1].num_players).toEqual(2);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/game/get_games');
  });
});
