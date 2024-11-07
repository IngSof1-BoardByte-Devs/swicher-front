import clsx from 'clsx';
import { useContext, useState } from 'react';

// context
import { GameIdContext, GameNameContext } from '@/contexts';

// types
import { Game } from '@/types/game';
import { Player } from '@/types/player';

export function GameList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchNumber, setSearchNumber] = useState(0);
    const contextGameID = useContext(GameIdContext);
    const contextGameName = useContext(GameNameContext);
    if (!contextGameID) {
        throw new Error('GameIdContext is not provided');
    }
    if (!contextGameName) {
        throw new Error('GameNameContext is not provided');
    }
    const [gameId, setGameId] = useState<number | null>(
        contextGameID?.contextGameID,
    );

    const games = [
        { game_id: 1, game_name: 'Partida 1', game_current_players: 2 },
        { game_id: 2, game_name: 'Partida 2', game_current_players: 1 },
        { game_id: 3, game_name: 'Partida 3', game_current_players: 3 },
        { game_id: 4, game_name: 'Partida 4', game_current_players: 1 },
        { game_id: 5, game_name: 'Partida 5', game_current_players: 2 },
        { game_id: 6, game_name: 'Partida 6', game_current_players: 3 },
        { game_id: 7, game_name: 'Partida 7', game_current_players: 1 },
        { game_id: 8, game_name: 'Partida 8', game_current_players: 2 },
        { game_id: 9, game_name: 'Partida 9', game_current_players: 3 },
    ];
    let filteredGames = games;
    filteredGames = games.filter((game) =>
        game.game_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    filteredGames =
        searchNumber === 0
            ? filteredGames
            : filteredGames.filter(
                  (game) => game.game_current_players === searchNumber,
              );
    if (!games.length) {
        return <p>No hay partidas disponibles</p>;
    }
    return (
        <section className="flex gap-3 flex-col">
            {/* Search bar */}
            <div className="flex gap-3">
                <input
                    type="text"
                    name="search"
                    placeholder="Buscar partidas..."
                    className="w-10/12 p-2 border rounded text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    name="searchNumber"
                    className="w-2/12 p-2 border rounded text-black"
                    value={searchNumber}
                    onChange={(e) => setSearchNumber(Number(e.target.value))}
                    style={{ color: '#8c8c8c' }}
                >
                    <option value={0}>-</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                </select>
            </div>
            {/* List */}
            <ul
                className={clsx('border divide-y-2 h-[336px] overflow-auto', {
                    'lg:h-[392px]': filteredGames.length === 7,
                    'lg:h-[448px]': filteredGames.length === 8,
                    'lg:h-[504px]': filteredGames.length > 8,
                })}
            >
                {filteredGames.map((game: Game) => {
                    return (
                        <button
                            className="w-full"
                            key={game.game_id}
                            onClick={() => {
                                contextGameID?.setContextGameID(game.game_id);
                                contextGameName?.setContextGameName(
                                    game.game_name,
                                );
                                setGameId(game.game_id);
                            }}
                        >
                            <li
                                className={clsx('p-4 flex justify-between', {
                                    'bg-slate-100': game.game_id === gameId,
                                })}
                            >
                                <p>{game.game_name}</p>
                                <p>{game.game_current_players}</p>
                            </li>
                        </button>
                    );
                })}
            </ul>
        </section>
    );
}

export function PlayerList() {
    const players = [
        { player_id: 1, player_name: 'Jugador 1' },
        { player_id: 2, player_name: 'Jugador 2' },
        { player_id: 3, player_name: 'Jugador 3' },
    ];
    return (
        <ul className="w-full border divide-y-2">
            {players.map((player: Player) => {
                return (
                    <li
                        className="w-full p-4"
                        key={player.player_id + player.player_name}
                    >
                        <p>{player.player_name}</p>
                    </li>
                );
            })}
        </ul>
    );
}

export default GameList;
