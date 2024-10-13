import { create_game, fetch_games, join_game, revert_movements, start_game } from '@/lib/game';
import fetchMock from 'jest-fetch-mock';


global.fetch = jest.fn();
fetchMock.enableMocks();

describe('create_game function', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  it('should handle both a successful 200 response and a failure', async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({
      status: 'OK',
      message: 'Game created successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));

    const successResult = await create_game({ player_name: 'John', game_name: 'Test Game' });

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/games/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_name: 'John', game_name: 'Test Game' }),
    });

    expect(successResult).toEqual({ status: 'OK', message: 'Game created successfully' });

    fetchMock.mockRejectedValueOnce(new Error('An error occurred while creating the game'));

    const failResult = await create_game({ player_name: 'John', game_name: 'Test Game' });

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
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/games/');
  });
});

describe('join_game', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return success when the fetch request is successful', async () => {
    const mockResponse = { status: 'SUCCESS', message: 'Joined the game successfully' };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await join_game({ player_name: 'John Doe', game_id: 1 });

    expect(result).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/players/', expect.any(Object));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch failure', async () => {
    fetchMock.mockRejectOnce(new Error('Failed to fetch'));

    const result = await join_game({ player_name: 'John Doe', game_id: 1 });

    expect(result).toEqual({ status: 'ERROR', message: 'Failed to fetch' });
  });

  it('should return error if player_name is missing', async () => {

    const result = await join_game({ player_name: '', game_id: 1 });

    expect(result).toEqual({ status: 'ERROR', message: 'Nombre de jugador invalido' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});


describe('start_game', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });
  test('url should be correct', async () => {
    const player_id = 1;
    const result = await start_game({ player_id });
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/games/${player_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
  test('should return success when the fetch request is successful', async () => {
    const mockResponse = { status: 'OK', message: 'Game started successfully' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
    const result = await start_game({ player_id: 1 });
    expect(result).toEqual(mockResponse);
  });
});

describe('cancel movements', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  const game_id = 1;
  test('status 200', async () => {
    fetchMock.mockResponse(JSON.stringify({ status: "OK", message: "Turn reverted successfully" }), { status: 200 });
    const result = await revert_movements({ game_id: game_id });
    expect(result.message).toBe("Turn reverted successfully");
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/games/${game_id}/revert-moves`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
  test('status 404', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: "ERROR", detail: "No hay cambios para revertir" }), { status: 404 });
    const result = await revert_movements({ game_id: game_id });
    expect(result.message).toBe("No hay cambios para revertir");
    
  });

  test('status 401', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: "ERROR", detail: "No tienes permisos para cancelar los movimientos" }), { status: 401 });
    const result = await revert_movements({ game_id: game_id });
    expect(result.message).toBe("No tienes permisos para cancelar los movimientos");
 });
});
