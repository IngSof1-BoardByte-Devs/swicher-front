import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserForm, CreateGameForm } from '@/components/form';
import { join_game, create_game } from '@/lib/game';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/app/contexts/WebSocketContext';
import { useGameInfo } from '@/app/contexts/GameInfoContext';

jest.mock('@/lib/game', () => ({
  join_game: jest.fn(),
  create_game: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/contexts/WebSocketContext', () => ({
  useWebSocket: jest.fn(),
}));

jest.mock('@/app/contexts/GameInfoContext', () => ({
  useGameInfo: jest.fn(),
}));

describe('UserForm', () => {
  const mockPush = jest.fn();
  const mockSetIdGame = jest.fn();
  const mockSetIdPlayer = jest.fn();
  const mockSend = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useGameInfo as jest.Mock).mockReturnValue({
      setIdGame: mockSetIdGame,
      setIdPlayer: mockSetIdPlayer,
    });
    (useWebSocket as jest.Mock).mockReturnValue({ socket: { send: mockSend } });
    jest.clearAllMocks();
  });

  test('muestra un error si el campo de nombre de jugador está vacío', async () => {
    render(<UserForm gameId={1} />);

    fireEvent.click(screen.getByRole('button', { name: /unirse a la partida/i }));

    expect(await screen.findByText('Completar el campo')).toBeInTheDocument();
  });

  test('muestra un error si el nombre de jugador tiene caracteres no alfanuméricos', async () => {
    render(<UserForm gameId={1} />);

    fireEvent.change(screen.getByTestId('playerName'), { target: { value: 'Jugador!' } });
    fireEvent.click(screen.getByRole('button', { name: /unirse a la partida/i }));

    expect(await screen.findByText('Solo se permiten caracteres alfanuméricos')).toBeInTheDocument();
  });

  test('llama a join_game y maneja el error si la respuesta tiene un estado de ERROR', async () => {
    (join_game as jest.Mock).mockResolvedValue({
      status: 'ERROR',
      message: 'Error al unirse a la partida',
    });

    render(<UserForm gameId={1} />);
    
    fireEvent.change(screen.getByTestId('playerName'), { target: { value: 'Jugador1' } });
    fireEvent.click(screen.getByRole('button', { name: /unirse a la partida/i }));

    expect(join_game).toHaveBeenCalledWith({
      player_name: 'Jugador1',
      game_id: 1,
    });
    expect(await screen.findByText('Error al unirse a la partida')).toBeInTheDocument();
  });

  test('redirecciona al lobby y envía el mensaje de socket en caso de éxito', async () => {
    (join_game as jest.Mock).mockResolvedValue({
      status: 'OK',
      player_id: 123,
    });

    render(<UserForm gameId={1} />);
    
    fireEvent.change(screen.getByTestId('playerName'), { target: { value: 'Jugador1' } });
    fireEvent.click(screen.getByRole('button', { name: /unirse a la partida/i }));

    await waitFor(() => {
      expect(mockSetIdPlayer).toHaveBeenCalledWith(123);
      expect(mockSetIdGame).toHaveBeenCalledWith(1);
      expect(mockSend).toHaveBeenCalledWith('/join 1');
      expect(mockPush).toHaveBeenCalledWith('/lobby/');
    });
  });
});

describe('CreateGameForm', () => {
  const mockPush = jest.fn();
  const mockSetIdGame = jest.fn();
  const mockSetIdPlayer = jest.fn();
  const mockSend = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useGameInfo as jest.Mock).mockReturnValue({
      setIdGame: mockSetIdGame,
      setIdPlayer: mockSetIdPlayer,
    });
    (useWebSocket as jest.Mock).mockReturnValue({ socket: { send: mockSend } });
    jest.clearAllMocks();
  });

  test('muestra un error si los campos están vacíos', async () => {
    render(<CreateGameForm />);

    fireEvent.click(screen.getByRole('button', { name: /crear partida/i }));

    expect(await screen.findByText('Todos los campos son obligatorios')).toBeInTheDocument();
  });

  test('muestra un error si los campos tienen caracteres no alfanuméricos', async () => {
    render(<CreateGameForm />);

    fireEvent.change(screen.getByLabelText('Nombre de usuario'), { target: { value: 'Jugador!' } });
    fireEvent.change(screen.getByLabelText('Nombre de la partida'), { target: { value: 'Partida!' } });
    fireEvent.click(screen.getByRole('button', { name: /crear partida/i }));

    expect(await screen.findByText('Solo se permiten caracteres alfanuméricos')).toBeInTheDocument();
  });

  test('llama a create_game y maneja el error si la respuesta tiene un estado de ERROR', async () => {
    (create_game as jest.Mock).mockResolvedValue({
      status: 'ERROR',
      message: 'Error al crear la partida',
    });

    render(<CreateGameForm />);
    
    fireEvent.change(screen.getByLabelText('Nombre de usuario'), { target: { value: 'Jugador1' } });
    fireEvent.change(screen.getByLabelText('Nombre de la partida'), { target: { value: 'Partida1' } });
    fireEvent.click(screen.getByRole('button', { name: /crear partida/i }));

    expect(create_game).toHaveBeenCalledWith({
      player_name: 'Jugador1',
      game_name: 'Partida1',
    });
    expect(await screen.findByText('Error al crear la partida')).toBeInTheDocument();
  });

  test('redirecciona al lobby y envía el mensaje de socket en caso de éxito', async () => {
    (create_game as jest.Mock).mockResolvedValue({
      status: 'OK',
      player_id: 123,
      game_id: 456,
    });

    render(<CreateGameForm />);
    
    fireEvent.change(screen.getByLabelText('Nombre de usuario'), { target: { value: 'Jugador1' } });
    fireEvent.change(screen.getByLabelText('Nombre de la partida'), { target: { value: 'Partida1' } });
    fireEvent.click(screen.getByRole('button', { name: /crear partida/i }));

    await waitFor(() => {
      expect(mockSetIdPlayer).toHaveBeenCalledWith(123);
      expect(mockSetIdGame).toHaveBeenCalledWith(456);
      expect(mockSend).toHaveBeenCalledWith('/join 456');
      expect(mockPush).toHaveBeenCalledWith('/lobby/');
    });
  });
});
