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
        const response = await fetch(`http://localhost:8000/games/${id_game}/figure-cards`);

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

export async function fetch_movement_cards({ id_player }: { id_player: number }) {
    if (!id_player) {
        console.error("Error: el player_id must be filed")
        return { status: "ERROR", message: "invalid player id" }
    }
    try {
        const response = await fetch(`http://localhost:8000/games/${id_player}/move-cards`);
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Faild to get movment cards:", error);
        return {
            status: "ERROR",
            message: "An error occurred while getting the movement cards"
        }
    }
}

export async function use_movement_cards(
    { id_player, id_card, index1, index2 }: 
    { id_player: number, id_card: number, index1:number, index2:number }) {
    try {
        const response = await fetch(`http://localhost:8000/movement-cards/${id_card}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_player,
                index1,
                index2,
            })
        });
        
        if (response.status === 200) {
            return 
        }
    } catch (error) {
        console.error("Failed to use movement cards:", error);
        return {
            status: "ERROR",
            message: "An error occurred while using the movement cards"
        }
    }

}