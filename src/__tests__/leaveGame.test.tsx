import { leave_game } from '@/lib/game';

import fetchMock from 'jest-fetch-mock';

global.fetch = jest.fn();
fetchMock.enableMocks();
describe("leave_game", () => {
  const game_id = 1;
  const player_id = 123;

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test("debería retornar un error cuando player_id o game_id son inválidos", async () => {
    const result = await leave_game({ game_id: 0, player_id });
    expect(result).toEqual({
      status: "ERROR",
      message: "No se encontro el id del jugador o del game",
    });

    const result2 = await leave_game({ game_id, player_id: 0 });
    expect(result2).toEqual({
      status: "ERROR",
      message: "No se encontro el id del jugador o del game",
    });

    expect(fetch).toHaveBeenCalledTimes(0); // No debería llamar a fetch si los IDs son inválidos
  });

  test("debería retornar el resultado cuando la solicitud es exitosa", async () => {
    const mockResponse = { status: "OK", message: "Jugador eliminado de la partida" };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await leave_game({ game_id, player_id });
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/players/${game_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player_id }),
    });
  });

  test("debería lanzar un error con mensaje detallado cuando la solicitud falla", async () => {
    const errorDetail = { detail: "Error al eliminar al jugador" };
    fetchMock.mockResponseOnce(JSON.stringify(errorDetail), { status: 400 });

    const result = await leave_game({ game_id, player_id });
    expect(result).toEqual({
      status: "ERROR",
      message: errorDetail.detail,
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("debería manejar errores desconocidos y retornar un mensaje genérico", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));

    const result = await leave_game({ game_id, player_id });
    expect(result).toEqual({
      status: "ERROR",
      message: "Network error",
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
