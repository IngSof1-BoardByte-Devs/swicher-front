import { end_turn } from '@/lib/board';

import fetchMock from 'jest-fetch-mock';

global.fetch = jest.fn();
fetchMock.enableMocks();
describe('end turn function', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
      });

      it('debería devolver un mensaje de error si no se proporciona el id del jugador', async () => {
        const result = await end_turn(0); // Simula que no se proporciona un id válido
    
        expect(result).toBe('No se proporciono el id del jugador');
      });
    
      it('debería devolver "Turno finalizado" cuando la respuesta es 200', async () => {
        // Mock de fetch para simular éxito
        global.fetch = jest.fn(() =>
          Promise.resolve({
            status: 200,
          })
        ) as jest.Mock;
    
        const result = await end_turn(1);
    
        expect(result).toBe('Turno finalizado');
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8000/players/1/turn',
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player_id: 1 }),
          }
        );
      });
    
      it('debería devolver "Jugador no encontrado" cuando la respuesta es 404', async () => {
        // Mock de fetch para simular un error 404
        global.fetch = jest.fn(() =>
          Promise.resolve({
            status: 404,
          })
        ) as jest.Mock;
    
        const result = await end_turn(1);
    
        expect(result).toBe('Jugador no encontrado');
      });
    
      it('debería devolver "No es tu turno" cuando la respuesta es 401', async () => {
        // Mock de fetch para simular un error 401
        global.fetch = jest.fn(() =>
          Promise.resolve({
            status: 401,
          })
        ) as jest.Mock;
    
        const result = await end_turn(1);
    
        expect(result).toBe('No es tu turno');
      });
    
      it('debería devolver "Ocurrio un error desconocido" cuando la respuesta no es manejada', async () => {
        // Mock de fetch para simular un error desconocido (500)
        global.fetch = jest.fn(() =>
          Promise.resolve({
            status: 500,
          })
        ) as jest.Mock;
    
        const result = await end_turn(1);
    
        expect(result).toBe('Ocurrio un error desconocido');
      });
    
      it('debería devolver "Ocurrio un error desconocido" cuando ocurre una excepción', async () => {
        // Mock de fetch para simular un error de red
        global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;
    
        const result = await end_turn(1);
    
        expect(result).toBe('Ocurrio un error desconocido');
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8000/players/1/turn',
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player_id: 1 }),
          }
        );
  });
});