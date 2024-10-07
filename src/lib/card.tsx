export async function fetch_figure_cards({ id_game }: { id_game: number }) {
  try {
    const response = await fetch(
      `http://localhost:8000/games/${id_game}/figure-cards`
    );

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Failed to fetch figure cards:", error);
    return {
      status: "ERROR",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function fetch_movement_cards({
  id_player,
}: {
  id_player: number;
}) {
  if (!id_player) {
    console.error("Error: el player_id must be filed");
    return { status: "ERROR", message: "invalid player id" };
  }
  try {
    const response = await fetch(
      `http://localhost:8000/games/${id_player}/move-cards`
    );
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to get movement cards:", error);
    return {
      status: "ERROR",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
