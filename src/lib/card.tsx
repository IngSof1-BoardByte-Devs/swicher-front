export async function fetch_figure_cards({ player_id }: { player_id: number }) {
   try {
       const response = await fetch(`http://localhost:8000/game/figure_cards`, {
           method: 'POST',
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify({ "player_id": player_id }),
       });

       if (!response.ok) {
           throw new Error(`Server responded with status ${response.status}`);
       }

       const result = await response.json();

       return result;

   } catch (error) {
       console.error('Failed to fetch figure cards:', error);
       return { status: 'ERROR', message: 'An error occurred while fetching the figure cards' };
   }
}