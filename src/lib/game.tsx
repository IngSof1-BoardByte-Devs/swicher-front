export async function create_game({
  player_name,
  game_name,
  password,
}: {
  player_name: string;
  game_name: string;
  password: string;
}) {
  if (!player_name || !game_name) {
    console.error(
      "Error: player_name and game_name must be provided and cannot be empty"
    );
    return { status: "ERROR", message: "Nombre de jugador o partida invalidos" };
  }

  try {
    const response = await fetch("http://localhost:8000/games/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player_name, game_name, password }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to create game:", error);
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Ocurrio un error desconocido",
    };
  }
}

export async function join_game({
  player_name,
  game_id,
}: {
  player_name: string;
  game_id: number;
}) {
  if (!player_name) {
    console.error("Error: player_name must be provided and cannot be empty");
    return { status: "ERROR", message: "Nombre de jugador invalido" };
  }

  try {
    const response = await fetch("http://localhost:8000/players/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ game_id, player_name }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to join game:", error);
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Ocurrio un error desconocido",
    };
  }
}


export async function fetch_games() {
  try {
    const response = await fetch("http://localhost:8000/games/");

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Ocurrio un error desconocido",
    };
  }
}

export async function start_game({ player_id }: { player_id: number }) {
  try {
    const response = await fetch(`http://localhost:8000/games/${player_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to start game:", error);
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Ocurrio un error desconocido",
    };
  }
}

export async function fetch_game({ game_id }: { game_id: number }) {
  try {
    const response = await fetch(`http://localhost:8000/games/${game_id}/`);

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch game:", error);
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Ocurrio un error desconocido",
    };
  }
}

export async function leave_game({ player_id }: { player_id: number }) {
  if (!player_id) {
    return { status: "ERROR", message: "No se encontro el id del jugador" }
  };
  try {
    const response = await fetch(`http://localhost:8000/players/${player_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to leave game:", error);
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Ocurrio un error desconocido",
    };
  }
}

export async function revert_movements({ game_id, player_id }: { game_id: number, player_id: number }) {
  if (!game_id || !player_id) return "Id de jugador o partida invalidos";
  try {
    const response = await fetch(`http://localhost:8000/games/${game_id}/revert-moves`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id }),
    });
    if (response.status === 200) {
      return "Movimientos revertidos";
    } else if (response.status === 404) {
      return "Jugador no encontrado";
    } else if (response.status === 401) {
      return "No es tu turno";
    } else {
      return "Ocurrio un error desconocido";
    }
    } catch (error) {
      console.error("Failed to revert movements:", error);
      return "Ocurrio un error desconocido"
    }

}