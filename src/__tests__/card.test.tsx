import { react } from 'react';
import { Card } from "@/components/cards";
import { fetch_figure_cards, fetch_movement_cards, use_movement_cards, use_figure_cards } from "@/lib/card";
import { fireEvent, render, screen, waitFor  } from "@testing-library/react";
import "@testing-library/jest-dom";

import fetchMock from "jest-fetch-mock";
global.fetch = jest.fn();
fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

const id_game = 1;
const id_player = 1;

// Mock de Framer Motion para evitar problemas con la animación
jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
  },
}));

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
  it("debe retornar un error cuando id_player es inválido", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const response = await fetch_movement_cards({ id_player: 0 });

    // Verifica que console.error se llame con el mensaje adecuado
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: el player_id must be filed");

    // Verifica que la respuesta tenga el mensaje de error correcto
    expect(response).toEqual({ status: "ERROR", message: "id de jugador invalido" });

    // Restaura el mock de console.error
    consoleErrorSpy.mockRestore();
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

describe("Card Component", () => {
  const defaultProps = {
    type: true,
    id: "test-card-id",
    idCard: 1,
    selectedCard: null,
    setSelectedCard: jest.fn(),
    isSelectable: true,
    setMoveCard: jest.fn(),
    usedCard: false,
    setFigCard: jest.fn(),
    setFigCardId: jest.fn(),
    setMovCardId: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly and triggers onClick to select the card", async () => {
    const { getByRole } = render(<Card {...defaultProps} index={1} />);
    const card = getByRole("button");

    // Hacer clic para seleccionar la carta
    fireEvent.click(card);
    await waitFor(() => expect(defaultProps.setSelectedCard).toHaveBeenCalledWith("test-card-id"));
    expect(defaultProps.setFigCard).toHaveBeenCalledWith("fig1");
    expect(defaultProps.setFigCardId).toHaveBeenCalledWith(1);
  });

  it("deselects the card when clicked again", async () => {
    const { getByRole } = render(<Card {...defaultProps} selectedCard="test-card-id" index={1} />);
    const card = getByRole("button");

    // Hacer clic para deseleccionar la carta
    fireEvent.click(card);
    await waitFor(() => expect(defaultProps.setSelectedCard).toHaveBeenCalledWith(null));
    expect(defaultProps.setMoveCard).toHaveBeenCalledWith("");
    expect(defaultProps.setFigCard).toHaveBeenCalledWith("");
    expect(defaultProps.setFigCardId).toHaveBeenCalledWith(null);
  });

  it("selects a movement card when type is false", async () => {
    const { getByRole } = render(<Card {...defaultProps} type={false} index={1} />);
    const card = getByRole("button");

    fireEvent.click(card);
    await waitFor(() => expect(defaultProps.setSelectedCard).toHaveBeenCalledWith("test-card-id"));
    expect(defaultProps.setMoveCard).toHaveBeenCalledWith("mov1");
    expect(defaultProps.setMovCardId).toHaveBeenCalledWith(1);
  });

  it("selects figure cards with index between 10 and 18", async () => {
    const { getByRole } = render(<Card {...defaultProps} index={15} />);
    const card = getByRole("button");

    fireEvent.click(card);
    await waitFor(() => expect(defaultProps.setSelectedCard).toHaveBeenCalledWith("test-card-id"));
    expect(defaultProps.setFigCard).toHaveBeenCalledWith("fig15");
    expect(defaultProps.setFigCardId).toHaveBeenCalledWith(1);
  });

  it("selects easy figure cards with index greater than 18", async () => {
    const { getByRole } = render(<Card {...defaultProps} index={19} />);
    const card = getByRole("button");
  
    fireEvent.click(card);
    await waitFor(() => expect(defaultProps.setSelectedCard).toHaveBeenCalledWith("test-card-id"));
    expect(defaultProps.setFigCard).toHaveBeenCalledWith("fig19");
    expect(defaultProps.setFigCardId).toHaveBeenCalledWith(1);
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
      'http://localhost:8000/movement-cards/10/',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: 1,
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
      'http://localhost:8000/movement-cards/10/',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: 1,
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
      'http://localhost:8000/movement-cards/10/',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: 1,
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
      'http://localhost:8000/movement-cards/10/',
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: 1,
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
      `http://localhost:8000/figure-cards/10/`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: 1,
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
      `http://localhost:8000/figure-cards/10/`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: 1,
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
      `http://localhost:8000/figure-cards/10/`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: 1,
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
      `http://localhost:8000/figure-cards/10/`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: 1,
        }),
      }
    );
  });
});

