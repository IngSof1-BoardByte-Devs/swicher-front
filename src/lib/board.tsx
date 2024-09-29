export async function fetch_board({ id_game }: { id_game: number }) {
    try {
        const response = await fetch(`http://localhost:8000/games/${id_game}/board`);

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
export async function end_turn(player_id: number) {

    if (!player_id) {
        console.error("Error: el player_id must be filed")
        return {status: "ERROR", message:"invalid player id"}
    };

    try {
        const response = await fetch(`http://localhost:8000/players/${player_id}/turn`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ player_id })
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