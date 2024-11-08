import { fetch_board } from "@/lib/board";
import Gameboard from "@/components/gameboard";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'; 
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks(); 

const id_game = 1;

describe('fetch_board', () => {
    beforeEach(() => {
        fetchMock.resetMocks();  
    });

    it('debería devolver el tablero correctamente cuando la respuesta es exitosa', async () => {
        const mockResponse = { board: 'mocked_board_data' };
    
        // Mock de fetch para devolver una respuesta exitosa
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockResponse),
          })
        ) as jest.Mock;
    
        const result = await fetch_board({ id_game: 1 });
    
        expect(result).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/games/1/board');
      });
    
      it('debería devolver un mensaje de error si el servidor responde con un error', async () => {
        const mockErrorResponse = { detail: 'Error fetching board' };
    
        // Mock de fetch para devolver una respuesta de error
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve(mockErrorResponse),
          })
        ) as jest.Mock;
    
        const result = await fetch_board({ id_game: 1 });
    
        expect(result).toEqual({
          status: 'ERROR',
          message: 'Error fetching board',
        });
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/games/1/board');
      });
    
      it('debería devolver un mensaje de error si ocurre una excepción durante la solicitud', async () => {
        // Mock de fetch para simular un error de red
        global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;
    
        const result = await fetch_board({ id_game: 1 });
    
        expect(result).toEqual({
          status: 'ERROR',
          message: 'Network Error',
        });
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/games/1/board');
      });
      
      it('debería devolver "Ocurrio un error desconocido" si el error no es una instancia de Error', async () => {
        // Mock de fetch para simular un error no estándar (por ejemplo, un error que no sea una instancia de Error)
        global.fetch = jest.fn(() => Promise.reject('Unknown Error')) as jest.Mock;
    
        const result = await fetch_board({ id_game: 1 });
    
        expect(result).toEqual({
          status: 'ERROR',
          message: 'Ocurrio un error desconocido',
        });
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/games/1/board');
      });
    });

describe("Gameboard Component", () => {
    beforeEach(() => {
        fetchMock.resetMocks();  
    });

    test("renders correctly", async () => {
        const mockBoardResponse = {
            board: Array(36).fill({ color: 1 })  
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockBoardResponse));  

        render(<Gameboard id_game={id_game} />);
        const gameboardElement = await screen.findByRole('grid');
        expect(gameboardElement).toBeInTheDocument();
    });

    test("renders 36 pieces", async () => {
        const mockBoardResponse = {
            board: Array(36).fill({ color: 1 })  
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockBoardResponse));  

        render(<Gameboard id_game={id_game} />);
        const pieces = await screen.findAllByRole("piece");
        expect(pieces).toHaveLength(36);
    });
});
