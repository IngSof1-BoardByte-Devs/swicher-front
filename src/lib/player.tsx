export async function create_player({
    player_name,
    game_id,
}: {
    player_name: string;
    game_id: number;
}) {
    if (!player_name) {
        console.error(
            'Error: player_name must be provided and cannot be empty',
        );
        return { status: 'ERROR', message: 'Nombre de jugador invalido' };
    }

    try {
        const response = await fetch('http://localhost:8000/players/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ game_id, player_name }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to join game:', error);
        return {
            status: 'ERROR',
            message:
                error instanceof Error
                    ? error.message
                    : 'Ocurrio un error desconocido',
        };
    }
}

export async function delete_player({ player_id }: { player_id: number }) {
    if (!player_id) {
        return { status: 'ERROR', message: 'No se encontro el id del jugador' };
    }
    try {
        const response = await fetch(
            `http://localhost:8000/players/${player_id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.detail);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to leave game:', error);
        return {
            status: 'ERROR',
            message:
                error instanceof Error
                    ? error.message
                    : 'Ocurrio un error desconocido',
        };
    }
}

export async function end_turn_player(player_id: number) {
    if (!player_id) return 'No se proporciono el id del jugador';
    try {
        const response = await fetch(
            `http://localhost:8000/players/${player_id}/turn`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            },
        );
        if (response.status === 200) {
            return 'Turno finalizado';
        } else if (response.status === 404) {
            return 'Jugador no encontrado';
        } else if (response.status === 401) {
            return 'No es tu turno';
        } else {
            return 'Ocurrio un error desconocido';
        }
    } catch (error) {
        console.error('Failed to end turn:', error);
        return 'Ocurrio un error desconocido';
    }
}
