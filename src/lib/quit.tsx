export async function LeaveGame({player_id, game_id}: {player_id: number, game_id: number}) {

    if (!player_id) {
        console.error("Error: el player_id must be filed")
        return {status: "ERROR", message:"invalid player id"}
    };
    if (!game_id) {
        console.error("Error: el game_id must be filed")
        return {status: "ERROR", message:"invalid game id"}
    };

    try {
        const response = await fetch("http://localhost:8000/leave-game", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ "player_id": player_id, "game_id": game_id }),
          });
          if (!response.ok) {
            throw new Error (`Server responded with ${response.status}`);         
          }
          const result = await response.json();
          return result;
    } catch (error) {
     console.error("Faild to leave the game:", error);
     return{
        status: "ERROR",
        message: "An error occurred while living the game"
     }
    }
}
