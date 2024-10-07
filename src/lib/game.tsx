export async function create_game({
  player_name,
  game_name,
}: {
  player_name: string;
  game_name: string;
}) {
  if (!player_name || !game_name) {
    console.error(
      "Error: player_name y game_name deben proporcionarse y no pueden estar vacíos"
    );
    return { status: "ERROR", message: "player_name o game_name invalidos" };
  }

  try {
    const response = await fetch("http://localhost:8000/games/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player_name, game_name }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to create game:", error);
    return {
      status: "ERROR",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
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
    return { status: "ERROR", message: "Invalid player_name" };
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
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to join game:", error);
    return {
      status: "ERROR",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function fetch_games() {
  try {
    const response = await fetch("http://localhost:8000/games/");

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return {
      status: "ERROR",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
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
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to start game:", error);
    return {
      status: "ERROR",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function fetch_game({ game_id }: { game_id: number }) {
  try {
    const response = await fetch(`http://localhost:8000/games/${game_id}/`);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch game:", error);
    return {
      status: "ERROR",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function leave_game({ player_id }: { player_id: number }) {
  if (!player_id) {
    console.error("Error: player_id must be provided");
    return { status: "ERROR", message: "Invalid player_id" };
  }

  try {
    const response = await fetch(`http://localhost:8000/players/${player_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to leave the game:", error);
    return {
      status: "ERROR",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
