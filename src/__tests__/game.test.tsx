import { create_game, join_game, start_game } from '@/lib/game';
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

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/game/create_game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_name: 'John', game_name: 'Test Game' }),
    });

    expect(successResult).toEqual({ status: 'OK', message: 'Game created successfully' });

    fetchMock.mockResolvedValueOnce(new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    }));

    const failResult = await create_game({ player_name: 'John', game_name: 'Test Game' });

    expect(failResult).toEqual({ status: 'ERROR', message: 'An error occurred while creating the game' });
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
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/game/join_game', expect.any(Object));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch failure', async () => {
    fetchMock.mockRejectOnce(new Error('Failed to fetch'));

    const result = await join_game({ player_name: 'John Doe', game_id: 1 });

    expect(result).toEqual({ status: 'ERROR', message: 'An error occurred while creating the game' });
  });

  it('should return error if player_name is missing', async () => {

    const result = await join_game({ player_name: '', game_id: 1 });
    
    expect(result).toEqual({ status: 'ERROR', message: 'Invalid player_name' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});


describe('start_game', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });
  test('url should be correct', async () => {
    const result = await start_game({ game_id: 1, player_id: 1 });
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/game/start_game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_id: 1, player_id: 1 }),
    });
  });
  test('should return success when the fetch request is successful', async () => {
    const mockResponse = { status: 'OK', message: 'Game started successfully' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
    const result = await start_game({ game_id: 1, player_id: 1 });
    expect(result).toEqual(mockResponse);
  });
}); 