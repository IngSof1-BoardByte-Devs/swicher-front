import { create_game, fetch_game, fetch_games, join_game, revert_movements, start_game } from '@/lib/game';
import fetchMock from 'jest-fetch-mock';


global.fetch = jest.fn();
fetchMock.enableMocks();


describe("create_game", () => {
  const player_name = "Jugador1";
  const game_name = "Partida1";

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test("debería retornar un error cuando player_name o game_name son inválidos", async () => {
    const result = await create_game({ player_name: "", game_name });
    expect(result).toEqual({
      status: "ERROR",
      message: "Nombre de jugador o partida invalidos",
    });

    const result2 = await create_game({ player_name, game_name: "" });
    expect(result2).toEqual({
      status: "ERROR",
      message: "Nombre de jugador o partida invalidos",
    });

    expect(fetch).toHaveBeenCalledTimes(0); // No debería llamar a fetch si los nombres son inválidos
  });

  test("debería retornar el resultado cuando la solicitud es exitosa", async () => {
    const mockResponse = { status: "OK", game_id: 1 };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await create_game({ player_name, game_name });
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/games/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player_name, game_name }),
    });
  });

  test("debería lanzar un error con mensaje detallado cuando la solicitud falla", async () => {
    const errorDetail = { detail: "Error al crear la partida" };
    fetchMock.mockResponseOnce(JSON.stringify(errorDetail), { status: 400 });

    const result = await create_game({ player_name, game_name });
    expect(result).toEqual({
      status: "ERROR",
      message: errorDetail.detail,
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("debería manejar errores desconocidos y retornar un mensaje genérico", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));

    const result = await create_game({ player_name, game_name });
    expect(result).toEqual({
      status: "ERROR",
      message: "Network error",
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('fetch_games', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should return games data when the fetch is successful', async () => {
    const mockData = { games: [{ id: 1, name: 'Game 1' }] };

    fetchMock.mockResponseOnce(JSON.stringify(mockData), { status: 200 });

    const result = await fetch_games();

    expect(result).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/games/');
  });

  it('should handle errors if the fetch response is not ok', async () => {
    const mockError = { detail: 'Failed to fetch games' };

    fetchMock.mockResponseOnce(
      JSON.stringify(mockError),
      { status: 400 }
    );

    const result = await fetch_games();

    expect(result).toEqual({
      status: 'ERROR',
      message: 'Failed to fetch games',
    });
  });

  it('should handle network errors gracefully', async () => {
    fetchMock.mockRejectOnce(new Error('Network Error'));

    const result = await fetch_games();

    expect(result).toEqual({
      status: 'ERROR',
      message: 'Network Error',
    });
  });
});

describe('join_game function', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should return an error if player_name is not provided', async () => {
    const response = await join_game({ player_name: '', game_id: 1 });

    expect(response.status).toBe('ERROR');
    expect(response.message).toBe('Nombre de jugador invalido');
  });

  it('should call the API and return the result on success', async () => {
    const mockResponse = { status: 'OK', player_id: 1 };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await join_game({ player_name: 'Player1', game_id: 1 });

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/players/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ game_id: 1, player_name: 'Player1' }),
    });
    expect(response).toEqual(mockResponse);
  });

  it('should handle error if the response is not ok', async () => {
    const mockErrorResponse = { detail: 'Game not found' };
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => mockErrorResponse,
    });

    const response = await join_game({ player_name: 'Player1', game_id: 999 });

    expect(response.status).toBe('ERROR');
    expect(response.message).toBe('Game not found');
  });

  it('should catch network or unexpected errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const response = await join_game({ player_name: 'Player1', game_id: 1 });

    expect(response.status).toBe('ERROR');
    expect(response.message).toBe('Network error');
  });
});


describe("start_game", () => {
  const game_id = 1;
  const player_id = 1;

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test("debería retornar el resultado cuando la solicitud es exitosa", async () => {
    const mockResponse = { status: "OK", game_started: true };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await start_game({ game_id, player_id });

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/games/${game_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
  });

  test("debería lanzar un error con mensaje detallado cuando la solicitud falla", async () => {
    const errorDetail = { detail: "Error de inicio de partida" };
    fetchMock.mockResponseOnce(JSON.stringify(errorDetail), { status: 400 });

    const result = await start_game({ game_id, player_id });

    expect(result).toEqual({
      status: "ERROR",
      message: errorDetail.detail,
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("debería manejar errores desconocidos y retornar un mensaje genérico", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));

    const result = await start_game({ game_id, player_id });

    expect(result).toEqual({
      status: "ERROR",
      message: "Network error",
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe("revert_movements", () => {
  const game_id = 1;
  const player_id = 123;
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test("debería retornar mensaje de error cuando game_id o player_id son inválidos", async () => {
    const result = await revert_movements({ game_id: 0, player_id });
    expect(result).toBe("Id de jugador o partida invalidos");

    const result2 = await revert_movements({ game_id, player_id: 0 });
    expect(result2).toBe("Id de jugador o partida invalidos");

    expect(fetch).toHaveBeenCalledTimes(0); // No debería llamar a fetch si los IDs son inválidos
  });

  test("debería retornar 'Movimientos revertidos' cuando la solicitud es exitosa (200)", async () => {
    fetchMock.mockResponseOnce("", { status: 200 });

    const result = await revert_movements({ game_id, player_id });
    expect(result).toBe("Movimientos revertidos");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/games/${game_id}/revert-moves`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player_id }),
    });
  });

  test("debería retornar 'Jugador no encontrado' cuando el estado es 404", async () => {
    fetchMock.mockResponseOnce("", { status: 404 });

    const result = await revert_movements({ game_id, player_id });
    expect(result).toBe("Jugador no encontrado");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("debería retornar 'No es tu turno' cuando el estado es 401", async () => {
    fetchMock.mockResponseOnce("", { status: 401 });

    const result = await revert_movements({ game_id, player_id });
    expect(result).toBe("No es tu turno");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("debería retornar 'Ocurrio un error desconocido' cuando hay un error de red u otro error desconocido", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));

    const result = await revert_movements({ game_id, player_id });
    expect(result).toBe("Ocurrio un error desconocido");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("debería retornar 'Ocurrio un error desconocido' para códigos de estado no manejados", async () => {
    fetchMock.mockResponseOnce("", { status: 500 });

    const result = await revert_movements({ game_id, player_id });
    expect(result).toBe("Ocurrio un error desconocido");
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe("fetch_game", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("debe retornar un error si el `game_id` no está definido", async () => {
    const result = await fetch_game({ game_id: undefined as any });
    expect(result).toEqual({
      status: "ERROR",
      message: "No se encontró el id del juego",
    });
  });

  it("debe obtener la partida correctamente y retornar la respuesta del servidor", async () => {
    const mockResponse = { status: "OK", game: { id: 1, name: "Test Game" } };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await fetch_game({ game_id: 1 });
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8000/games/1/");
    expect(result).toEqual(mockResponse);
  });

  it("debe retornar un error si el servidor responde con un estado no 200", async () => {
    const mockErrorResponse = { detail: "Juego no encontrado" };
    fetchMock.mockResponseOnce(JSON.stringify(mockErrorResponse), { status: 404 });

    const result = await fetch_game({ game_id: 1 });
    expect(result).toEqual({
      status: "ERROR",
      message: "Juego no encontrado",
    });
  });

  it("debe manejar errores de red o de fetch", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));

    const result = await fetch_game({ game_id: 1 });
    expect(result).toEqual({
      status: "ERROR",
      message: "Network error",
    });
  });
});