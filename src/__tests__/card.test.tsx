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
  it("url should be correct with a GET ", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: "OK" }));

    await fetch_figure_cards({ id_game });


    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:8000/games/${id_game}/figure-cards`,
    );
  });

  it("should throw an error when the server response is not successful", async () => {
    fetchMock.mockRejectedValueOnce(new Error('An error occurred while fetching the figure cards'));
    const result = await fetch_figure_cards({ id_game });
    expect(result).toEqual({
      status: "ERROR",
      message: "An error occurred while fetching the figure cards",
    });
  });

  it("should return success when the fetch request is successful", async () => {
    const mockResponse = {
      status: "OK",
      message: "Figure cards fetched successfully",
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await fetch_figure_cards({ id_game });

    expect(result).toEqual(mockResponse);
  });
});

describe("GetMoveCard", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  test('url should be correct', async () => {
    const result = await fetch_movement_cards({ id_player });
    console.log(result);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/games/${id_player}/move-cards`);
  });

  test('should return success when the fetch request is successful', async () => {
    const mockResponse = { status: 'OK', message: 'Movement cards fetched successfully' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
    const result = await fetch_movement_cards({ id_player });
    expect(result).toEqual(mockResponse);
  });

  test('should return error when the fetch request fails', async () => {
    const mockResponse = { status: 'ERROR', message: 'An error occurred while getting the movement cards' };
    fetchMock.mockRejectOnce(new Error('An error occurred while getting the movement cards'));
    const result = await fetch_movement_cards({ id_player });
    expect(result).toEqual(mockResponse);
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
  test('status 200', async () => {
    fetchMock.mockResponse(JSON.stringify({ status: "ERROR", message: "invalid player id" }), { status: 200 });
    const result = await use_movement_cards({ id_player: id_player, id_card: id_card, index1: 1, index2: 2 });
    expect(result?.toString()).toBe("Carta usada con exito!");
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/movement-cards/${id_card}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_player: id_player,
        index1: 1,
        index2: 2,
      })
    });
  });
  test('status 404', async () => {
    fetchMock.mockResponse(JSON.stringify({ status: "ERROR", message: "invalid player id" }), { status: 404 });
    const result = await use_movement_cards({ id_player: id_player, id_card: id_card, index1: 1, index2: 2 });
    expect(result?.toString()).toBe("La carta enviada no existe o no se puede usar");
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/movement-cards/${id_card}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_player: id_player,
        index1: 1,
        index2: 2,
      })
    });
  });
  test('status 401', async () => {
    fetchMock.mockResponse(JSON.stringify({ status: "ERROR", message: "invalid player id" }), { status: 401 });
    const result = await use_movement_cards({ id_player: id_player, id_card: id_card, index1: 1, index2: 2 });
    expect(result?.toString()).toBe("No tienes permisos para usar esta carta");
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/movement-cards/${id_card}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_player: id_player,
        index1: 1,
        index2: 2,
      })
    });
  });
  test('error while fetching', async () => {
    fetchMock.mockReject(new Error('Network error'));
    const error = "Error: Network error";
    const result = await use_movement_cards({ id_player: id_player, id_card: id_card, index1: 1, index2: 2 });
    if (typeof result === 'object' && 'message' in result) {
      expect(result.message).toBe(`Error al intentar usar la carta id: ${id_card}, ${error}`);
    }
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/movement-cards/${id_card}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_player: id_player,
        index1: 1,
        index2: 2,
      })
    });
  });
});

describe('use_figure_cards', () => {
  it('debería retornar el resultado cuando la respuesta es exitosa', async () => {
    const mockResponse = { status: 'OK', data: 'Resultado exitoso' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await use_figure_cards({
      id_player: 123,
      id_card: 1,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/figure-cards/1/',
      expect.objectContaining({
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_player: 123 }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('debería lanzar un error con el mensaje adecuado cuando la respuesta no es exitosa', async () => {
    const mockErrorResponse = { detail: 'Error al usar la carta' };
    fetchMock.mockResponseOnce(JSON.stringify(mockErrorResponse), { status: 400 });

    const result = await use_figure_cards({
      id_player: 123,
      id_card: 1,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      status: 'ERROR',
      message: 'Error al usar la carta',
    });
  });

  it('debería manejar un error desconocido correctamente', async () => {
    fetchMock.mockReject(new Error('Error de red'));

    const result = await use_figure_cards({
      id_player: 123,
      id_card: 1,
    });

    expect(result).toEqual({
      status: 'ERROR',
      message: 'Error de red',
    });
  });
});

