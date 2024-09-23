export async function GetMoveCard({player_id}: {player_id: number}) {   
    if (!player_id) {
        console.error("Error: el player_id must be filed")
        return {status: "ERROR", message:"invalid player id"}
    }
    try {
        const response = await fetch(`http://localhost:8000/movement-cards?player_id=${player_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
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
        message: "An error occurred while getting the movement cards"
     }
    }
}
