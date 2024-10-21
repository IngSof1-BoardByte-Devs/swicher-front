export interface movement_card {
  id: number;
  id_player: number;
  type: number;
}

export interface figure_card {
  id: number;
  id_player: number;
  type: number;
  discarded: boolean;
  blocked: boolean;
}

export async function fetch_figure_cards({ id_game }: { id_game: number }) {
  try {
    const response = await fetch(
      `http://localhost:8000/games/${id_game}/figure-cards`
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch figure cards:", error);
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Ocurrio un error desconocido",
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
    return { status: "ERROR", message: "id de jugador invalido" };
  }
  try {
    const response = await fetch(
      `http://localhost:8000/games/${id_player}/move-cards`
    );
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.detail);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch movement cards:", error);
    return {
      status: "ERROR",
      message: error instanceof Error ? error.message : "Ocurrio un error desconocido",
    };
  }
}

export async function use_movement_cards(
  { id_player, id_card, index1, index2 }:
    { id_player: number, id_card: number, index1: number, index2: number }) {
  try {
    const playerId = id_player;
    const response = await fetch(`http://localhost:8000/movement-cards/${id_card}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        playerId,
        index1,
        index2,
      })
    });
    if (response.status === 200) {
      return "Carta usada con exito!";
    } else if (response.status === 404) {
      return "La carta enviada no existe o no se puede usar"
    } else if (response.status === 401) {
      return "No tienes permisos para usar esta carta"
    };
  } catch (error) {
    return "Ocurrio un error desconocido";
  }

}

export async function use_figure_cards({ id_player, id_card }: { id_player: number; id_card: number }) {
  const playerId = id_player;
  const card_id = id_card;
  console.log("playerId", playerId);
  try {
    const response = await fetch(
      `http://localhost:8000/figure-cards/${card_id}/?playerId=${playerId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      return "Carta usada con exito!";
    } else if (response.status === 404) {
      return "La carta enviada no existe o no se puede usar"
    } else if (response.status === 401) {
      return "No tienes permisos para usar esta carta"
    };
  } catch (error) {
    return "Ocurrio un error desconocido";
  }
}