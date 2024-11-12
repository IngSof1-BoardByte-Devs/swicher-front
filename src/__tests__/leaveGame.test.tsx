import { leave_game } from '@/lib/game';

import fetchMock from 'jest-fetch-mock';

global.fetch = jest.fn();
fetchMock.enableMocks();
describe("leave_game", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("debe retornar un error si el `player_id` no está definido", async () => {
    const result = await leave_game({ player_id: undefined as any });
    expect(result).toEqual({
      status: "ERROR",
      message: "No se encontro el id del jugador",
    });
  });

  it("debe eliminar al jugador correctamente y retornar la respuesta del servidor", async () => {
    const mockResponse = { status: "OK", message: "Jugador eliminado" };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await leave_game({ player_id: 1 });
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8000/players/1", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it("debe retornar un error si el servidor responde con un estado no 200", async () => {
    const mockErrorResponse = { detail: "Jugador no encontrado" };
    fetchMock.mockResponseOnce(JSON.stringify(mockErrorResponse), { status: 404 });

    const result = await leave_game({ player_id: 1 });
    expect(result).toEqual({
      status: "ERROR",
      message: "Jugador no encontrado",
    });
  });

  it("debe manejar errores de red o de fetch", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));

    const result = await leave_game({ player_id: 1 });
    expect(result).toEqual({
      status: "ERROR",
      message: "Network error",
    });
  });
});
