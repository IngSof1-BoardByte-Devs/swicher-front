export async function create_game({game_name, player_name}: {game_name: string, player_name: string}) {
   if (!game_name || !player_name) {
     console.error('Error: game_name and player_name must be provided and cannot be empty');
     return { status: 'ERROR', message: 'Invalid game_name or player_name' };
   }
 
   try {
     const response = await fetch('http://localhost:8000/create_game', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ game_name, player_name })
     });
 
     if (!response.ok) {
       throw new Error(`Server responded with status ${response.status}`);
     }
 
     const result = await response.json();
 
     return result;
 
   } catch (error) {
     console.error('Failed to create game:', error);
     return { status: 'ERROR', message: 'An error occurred while creating the game' };
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
    console.error(
      "Error: player_name and game_id must be provided and cannot be empty"
    );
    return { status: "ERROR", message: "Invalid player_name" };
  }

  try {
    const response = await fetch("http://localhost:8000/join_game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "player_name": player_name, "game_id": game_id }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();

    return result;

  } catch (error) {
    console.error('Failed to create game:', error);
    return { status: 'ERROR', message: 'An error occurred while creating the game' };
  }
}

export async function fetch_games() {
  try {
    const response = await fetch('http://localhost:8000/game/get_games');

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();

    return result;

  } catch (error) {
    console.error('Failed to fetch games:', error);
    return { status: 'ERROR', message: 'An error occurred while fetching the games' };
  }
}
