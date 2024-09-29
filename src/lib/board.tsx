export async function fetch_board({ game_id }: { game_id: number }) {
    try {
        const response = await fetch(`http://localhost:8000/game/board`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "game_id": game_id }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const result = await response.json();

        return result;

    } catch (error) {
        console.error('Failed to fetch board:', error);
        return { status: 'ERROR', message: 'An error occurred while fetching the board' };
    }
}
export async function EndTurn(player_id: number) {

    if (!player_id) {
        console.error("Error: el player_id must be filed")
        return {status: "ERROR", message:"invalid player id"}
    };

    try {
        const response = await fetch("http://localhost:8000/end-turn", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ "player_id": player_id }),
          });
          if (!response.ok) {
            throw new Error (`Server responded with ${response.status}`);         
          }
          const result = await response.json();
          return result;
    } catch (error) {
     console.error("Faild to end turn:", error);
     return{
        status: "ERROR",
        message: "An error occurred while ending the turn"
     }
    }
}