export async function create_game({
    player_name,
    game_name,
}: {
    player_name: string;
    game_name: string;
}) {
    if (!player_name || !game_name) {
        console.error(
            'Error: player_name and game_name must be provided and cannot be empty',
        );
        return {
            status: 'ERROR',
            message: 'Nombre de jugador o partida invalidos',
        };
    }

    try {
        const response = await fetch('http://localhost:8000/games/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player_name: player_name,
                game_name: game_name,
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to create game:', error);
        return {
            status: 'ERROR',
            message:
                error instanceof Error
                    ? error.message
                    : 'Ocurrio un error desconocido',
        };
    }
}

export async function start_game({
    player_id,
    game_id,
}: {
    player_id: number;
    game_id: number;
}) {
    try {
        const response = await fetch(
            `http://localhost:8000/games/${game_id}/started`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ player_id: player_id }),
            },
        );

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to start game:', error);
        return {
            status: 'ERROR',
            message:
                error instanceof Error
                    ? error.message
                    : 'Ocurrio un error desconocido',
        };
    }
}

export async function revert_movements({
    game_id,
    player_id,
}: {
    game_id: number;
    player_id: number;
}) {
    if (!game_id || !player_id) return 'Id de jugador o partida invalidos';
    try {
        const response = await fetch(
            `http://localhost:8000/games/${game_id}/revert-movements`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_id: player_id }),
            },
        );
        if (response.status === 200) {
            return 'Movimientos revertidos';
        } else if (response.status === 404) {
            return 'Jugador no encontrado';
        } else if (response.status === 401) {
            return 'No es tu turno';
        } else {
            return 'Ocurrio un error desconocido';
        }
    } catch (error) {
        console.error('Failed to revert movements:', error);
        return 'Ocurrio un error desconocido';
    }
}
