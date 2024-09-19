import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react'
import {CreateGameForm, UserForm} from '@components/form';
import '@testing-library/jest-dom'

describe('CreateGameForm', () => {
    test('should render the form', () => {
        render(<CreateGameForm />);
        const inputGameName = screen.getByRole('textbox', { name: /Nombre de la partida/i });
        const inputPlayerName = screen.getByRole('textbox', { name: /Nombre de usuario/i });
        expect (inputGameName).toBeInTheDocument();
        expect (inputPlayerName).toBeInTheDocument();
    });

    test('should be required', () => {
        render(<CreateGameForm />);
    
    const inputGameName = screen.getByRole('textbox', { name: /Nombre de la partida/i });
    const inputPlayerName = screen.getByRole('textbox', { name: /Nombre de usuario/i });
    const submitButton = screen.getByRole('button', { name: /Crear partida/i });

    fireEvent.change(inputGameName, { target: { value: 'Game123' } });
    fireEvent.change(inputPlayerName, { target: { value: '' } });
    fireEvent.click(submitButton);
    expect(screen.getByText('Todos los campos son obligatorios')).toBeInTheDocument();

    fireEvent.change(inputGameName, { target: { value: 'Game@123' } });
    fireEvent.change(inputPlayerName, { target: { value: 'Player123' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Todos los campos son obligatorios')).not.toBeInTheDocument();
    });
    test('should show error message when fields are empty', () => {
        render(<CreateGameForm />);
        const inputGameName = screen.getByRole('textbox', { name: /Nombre de la partida/i });
        fireEvent.change(inputGameName, { target: { value: '' } });
        const inputPlayerName = screen.getByRole('textbox', { name: /Nombre de usuario/i });
        fireEvent.change(inputPlayerName, { target: { value: '' } });
        const submitButton = screen.getByRole('button', { name: /Unirse a la partida/i });
        fireEvent.click(submitButton);
    
        const errorMessage = screen.getByText('Todos los campos son obligatorios');
        expect(errorMessage).toBeInTheDocument();
    });
});

describe('UserForm', () => {
    const gameId = 1;
  
    beforeEach(() => {
      render(<UserForm gameId={gameId} />);
    });
  
    it('should render input and button', () => {
      const input = screen.getByTestId("playerName");
      const button = screen.getByRole('button', { name: /Unirse a la Partida/i });
  
      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
  
    it('should show error if player name is empty', async () => {
      const button = screen.getByRole('button', { name: /Unirse a la Partida/i });
      fireEvent.click(button);
  
      const errorMessage = await screen.findByText(/Completar el campo/i);
      expect(errorMessage).toBeInTheDocument();
    });
  
    it('should show error if player name is not alphanumeric', async () => {
      const input = screen.getByTestId("playerName");
      const button = screen.getByRole('button', { name: /Unirse a la Partida/i });
  
      fireEvent.change(input, { target: { value: 'Nombre@123' } });
      fireEvent.click(button);
  
      const errorMessage = await screen.findByText(/Solo se permiten caracteres alfanuméricos/i);
      expect(errorMessage).toBeInTheDocument();
    });

});