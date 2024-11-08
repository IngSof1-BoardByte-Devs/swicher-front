import { Card } from "@/components/cards";
import { fetch_figure_cards, fetch_movement_cards, use_movement_cards, use_figure_cards } from "@/lib/card";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

const id_game = 1;
const id_player = 1;

describe("fetch_figure_cards", () => {
  it('debería devolver las cartas de figura correctamente cuando la respuesta es exitosa', async () => {
    const mockResponse = { cards: ['card1', 'card2'] };

    // Mock de fetch para devolver una respuesta exitosa
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    ) as jest.Mock;

    const result = await fetch_figure_cards({ id_game: 1 });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/games/1/figure-cards');
  });

  it('debería devolver un mensaje de error si el servidor responde con un error', async () => {
    const mockErrorResponse = { detail: 'Error fetching figure cards' };

    // Mock de fetch para devolver una respuesta de error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(mockErrorResponse),
      })
    ) as jest.Mock;

    const result = await fetch_figure_cards({ id_game: 1 });

    expect(result).toEqual({
      status: 'ERROR',
      message: 'Error fetching figure cards',
    });
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/games/1/figure-cards');
  });

  it('debería devolver un mensaje de error si ocurre una excepción durante la solicitud', async () => {
    // Mock de fetch para simular un error de red
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;

    const result = await fetch_figure_cards({ id_game: 1 });

    expect(result).toEqual({
      status: 'ERROR',
      message: 'Network Error',
    });
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/games/1/figure-cards');
  });

  it('debería devolver "Ocurrio un error desconocido" si el error no es una instancia de Error', async () => {
    // Mock de fetch para simular un error no estándar (por ejemplo, un error que no sea una instancia de Error)
    global.fetch = jest.fn(() => Promise.reject('Unknown Error')) as jest.Mock;

    const result = await fetch_figure_cards({ id_game: 1 });

    expect(result).toEqual({
      status: 'ERROR',
      message: 'Ocurrio un error desconocido',
    });
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/games/1/figure-cards');
  });
});

describe("GetMoveCard", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  it('debería devolver un mensaje de error si id_player es inválido o no está definido', async () => {
    const result = await fetch_movement_cards({ id_player: 0 });

    expect(result).toEqual({
      status: 'ERROR',
      message: 'id de jugador invalido',
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('debería devolver las cartas de movimiento correctamente cuando la respuesta es exitosa', async () => {
    const mockResponse = { cards: ['move1', 'move2'] };

    // Mock de fetch para devolver una respuesta exitosa
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    ) as jest.Mock;

    const result = await fetch_movement_cards({ id_player: 1 });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/games/1/move-cards');
  });

  it('debería devolver un mensaje de error si el servidor responde con un error', async () => {
    const mockErrorResponse = { detail: 'Error fetching movement cards' };

    // Mock de fetch para devolver una respuesta de error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(mockErrorResponse),
      })
    ) as jest.Mock;

    const result = await fetch_movement_cards({ id_player: 1 });

    expect(result).toEqual({
      status: 'ERROR',
      message: 'Error fetching movement cards',
    });
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/games/1/move-cards');
  });

  it('debería devolver un mensaje de error si ocurre una excepción durante la solicitud', async () => {
    // Mock de fetch para simular un error de red
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;

    const result = await fetch_movement_cards({ id_player: 1 });

    expect(result).toEqual({
      status: 'ERROR',
      message: 'Network Error',
    });
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/games/1/move-cards');
  });

  it('debería devolver "Ocurrio un error desconocido" si el error no es una instancia de Error', async () => {
    // Mock de fetch para simular un error no estándar (por ejemplo, un error que no sea una instancia de Error)
    global.fetch = jest.fn(() => Promise.reject('Unknown Error')) as jest.Mock;

    const result = await fetch_movement_cards({ id_player: 1 });

    expect(result).toEqual({
      status: 'ERROR',
      message: 'Ocurrio un error desconocido',
    });
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/games/1/move-cards');
  });
});


describe('Card Component', () => {
  test('renders correctly', () => {
    render(<Card type={true} index={1} />);
    const cardElement = screen.getByRole('img', { name: /carta/i });
    expect(cardElement).toBeInTheDocument();
  });

  test('has the correct alt text', () => {
    render(<Card type={true} index={1} />);
    const cardElement = screen.getByRole('img', { name: /carta/i });
    expect(cardElement).toHaveAttribute('alt', 'carta');
  });

});

describe('use_movement_cards', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  const id_player = 1, id_card = 1;
  it('debería devolver un mensaje de éxito cuando la respuesta es 200', async () => {
    // Mock de fetch para devolver una respuesta exitosa
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
      })
    ) as jest.Mock;

    const result = await use_movement_cards({
      id_player: 1,
      id_card: 10,
      index1: 0,
      index2: 1,
    });

    expect(result).toBe("Carta usada con exito!");
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/movement-cards/10/status',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: 1,
          index1: 0,
          index2: 1,
        }),
      }
    );
  });

  it('debería devolver "La carta enviada no existe o no se puede usar" si la respuesta es 404', async () => {
    // Mock de fetch para devolver una respuesta con error 404
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 404,
      })
    ) as jest.Mock;

    const result = await use_movement_cards({
      id_player: 1,
      id_card: 10,
      index1: 0,
      index2: 1,
    });

    expect(result).toBe("La carta enviada no existe o no se puede usar");
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/movement-cards/10/status',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: 1,
          index1: 0,
          index2: 1,
        }),
      }
    );
  });

  it('debería devolver "No tienes permisos para usar esta carta" si la respuesta es 401', async () => {
    // Mock de fetch para devolver una respuesta con error 401
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 401,
      })
    ) as jest.Mock;

    const result = await use_movement_cards({
      id_player: 1,
      id_card: 10,
      index1: 0,
      index2: 1,
    });

    expect(result).toBe("No tienes permisos para usar esta carta");
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/movement-cards/10/status',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: 1,
          index1: 0,
          index2: 1,
        }),
      }
    );
  });

  it('debería devolver "Ocurrio un error desconocido" si ocurre una excepción durante la solicitud', async () => {
    // Mock de fetch para simular una excepción de red
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;

    const result = await use_movement_cards({
      id_player: 1,
      id_card: 10,
      index1: 0,
      index2: 1,
    });

    expect(result).toBe("Ocurrio un error desconocido");
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/movement-cards/10/status',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: 1,
          index1: 0,
          index2: 1,
        }),
      }
    );
  });
});

describe('use_figure_cards', () => {
  it('debería devolver un mensaje de éxito cuando la respuesta es 200', async () => {
    // Mock de fetch para devolver una respuesta exitosa
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
      })
    ) as jest.Mock;

    const result = await use_figure_cards({ id_player: 1, id_card: 10 });

    expect(result).toBe("Carta usada con exito!");
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/figure-cards/10/status',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: 1,
        }),
      }
    );
  });

  it('debería devolver "La carta enviada no existe o no se puede usar" si la respuesta es 404', async () => {
    // Mock de fetch para devolver una respuesta con error 404
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 404,
      })
    ) as jest.Mock;

    const result = await use_figure_cards({ id_player: 1, id_card: 10 });

    expect(result).toBe("La carta enviada no existe o no se puede usar");
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/figure-cards/10/status',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: 1,
        }),
      }
    );
  });

  it('debería devolver "No tienes permisos para usar esta carta" si la respuesta es 401', async () => {
    // Mock de fetch para devolver una respuesta con error 401
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 401,
      })
    ) as jest.Mock;

    const result = await use_figure_cards({ id_player: 1, id_card: 10 });

    expect(result).toBe("No tienes permisos para usar esta carta");
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/figure-cards/10/status',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: 1,
        }),
      }
    );
  });

  it('debería devolver "Ocurrio un error desconocido" si ocurre una excepción durante la solicitud', async () => {
    // Mock de fetch para simular una excepción de red
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;

    const result = await use_figure_cards({ id_player: 1, id_card: 10 });

    expect(result).toBe("Ocurrio un error desconocido");
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/figure-cards/10/status',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: 1,
        }),
      }
    );
  });
});

