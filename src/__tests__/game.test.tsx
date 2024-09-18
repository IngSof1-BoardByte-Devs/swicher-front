import { create_game } from '@/lib/game';
import { join_game } from '@/lib/game';

import fetchMock from 'jest-fetch-mock';

global.fetch = jest.fn();
fetchMock.enableMocks();

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

describe('join_game', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return success when the fetch request is successful', async () => {
    // Mock del cuerpo de la respuesta
    const mockResponse = { status: 'SUCCESS', message: 'Joined the game successfully' };
    
    // Configura el mock de fetch para que devuelva una respuesta exitosa
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
    
    // Llama a la función
    const result = await join_game({ player_name: 'John Doe', game_id: 1 });
    
    // Asegúrate de que la respuesta es la esperada
    expect(result).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/join_game', expect.any(Object));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch failure', async () => {
    // Configura el mock de fetch para que devuelva un error
    fetchMock.mockRejectOnce(new Error('Failed to fetch'));

    // Llama a la función
    const result = await join_game({ player_name: 'John Doe', game_id: 1 });

    // Asegúrate de que la respuesta es la esperada en caso de error
    expect(result).toEqual({ status: 'ERROR', message: 'An error occurred while creating the game' });
  });

  it('should return error if player_name is missing', async () => {
    // Llama a la función con player_name vacío
    const result = await join_game({ player_name: '', game_id: 1 });
    
    // Asegúrate de que la respuesta es la esperada para un nombre de jugador inválido
    expect(result).toEqual({ status: 'ERROR', message: 'Invalid player_name' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});