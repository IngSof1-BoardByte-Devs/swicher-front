import { create_game, fetch_games, join_game, revert_movements, start_game } from '@/lib/game';
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


describe('fetch_games function', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });
  it('should handle both a successful 200 response and a failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'OK', message: 'Game created successfully',
        games: [
          {
            game_id: '1',
            game_name: 'Test Game 1',
            num_players: 1,
          },
          {
            game_id: '2',
            game_name: 'Test Game 2',
            num_players: 2,
          },
        ],
      }),
    });
    const successResult = await fetch_games();
    expect(successResult.games).toHaveLength(2);
    expect(successResult.games[0].game_name).toEqual('Test Game 1');
    expect(successResult.games[1].game_name).toEqual('Test Game 2');
    expect(successResult.games[0].num_players).toEqual(1);
    expect(successResult.games[1].num_players).toEqual(2);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/games/');
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
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/players/', expect.any(Object));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch failure', async () => {
    fetchMock.mockRejectOnce(new Error('Failed to fetch'));

    const result = await join_game({ player_name: 'John Doe', game_id: 1 });

    expect(result).toEqual({ status: 'ERROR', message: 'Failed to fetch' });
  });

  it('should return error if player_name is missing', async () => {

    const result = await join_game({ player_name: '', game_id: 1 });

    expect(result).toEqual({ status: 'ERROR', message: 'Nombre de jugador invalido' });
    expect(fetchMock).not.toHaveBeenCalled();
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
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/games/${game_id}/started`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player_id }),
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
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/games/${game_id}/revert-movements`, {
      method: "PUT",
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
