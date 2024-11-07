export interface Player {
    player_id: number;
    player_name: string;
}

export interface Player_with_turn extends Player {
    turn: number;
}
