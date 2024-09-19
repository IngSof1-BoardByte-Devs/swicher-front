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