export async function fetch_board({ id_game }: { id_game: number }) {
  try {
    const response = await fetch(
      `http://localhost:8000/games/${id_game}/board`
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch board:", error);
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Ocurrio un error desconocido",
    };
  }
}
export async function end_turn(player_id: number) {
  if (!player_id) {
    console.error("Error: el player_id must be filed");
    return { status: "ERROR", message: "id de jugador invalido" };
  }

  try {
    const response = await fetch(
      `http://localhost:8000/players/${player_id}/turn`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_id }),
      }
    );
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to end turn:", error);
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Ocurrio un error desconocido",
    };
  }
}
