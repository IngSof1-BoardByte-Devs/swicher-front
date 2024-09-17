import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react'
import FormCrearPartida from '../components/formCreateGame';
import '@testing-library/jest-dom'
import { send } from 'process';

jest.mock('@lib/game');

describe('FormCrearPartida', () => {
    test('should render the form', () => {
        render(<FormCrearPartida />);
        const inputGameName = screen.getByRole('textbox', { name: /Nombre de la partida/i });
        const inputPlayerName = screen.getByRole('textbox', { name: /Nombre de usuario/i });
        expect (inputGameName).toBeInTheDocument();
        expect (inputPlayerName).toBeInTheDocument();
    });

    test('should be required', () => {
        render(<FormCrearPartida />);
    
    const inputGameName = screen.getByRole('textbox', { name: /Nombre de la partida/i });
    const inputPlayerName = screen.getByRole('textbox', { name: /Nombre de usuario/i });
    const submitButton = screen.getByRole('button', { name: /Crear partida/i });

    // Simulate incomplete inputs
    fireEvent.change(inputGameName, { target: { value: 'Game123' } });
    fireEvent.change(inputPlayerName, { target: { value: '' } });
    fireEvent.click(submitButton);

    // Assert that create_game function is not called
    expect(send).not.toHaveBeenCalled();

    // Simulate non-alphanumeric input
    fireEvent.change(inputGameName, { target: { value: 'Game@123' } });
    fireEvent.change(inputPlayerName, { target: { value: 'Player123' } });
    fireEvent.click(submitButton);

    // Assert that create_game function is not called
    expect(send).not.toHaveBeenCalled();
    });

    test('should show error message when fields are empty', () => {
        render(<FormCrearPartida />);
        const inputGameName = screen.getByRole('textbox', { name: /Nombre de la partida/i });
        const inputPlayerName = screen.getByRole('textbox', { name: /Nombre de usuario/i });
        const submitButton = screen.getByRole('button', { name: /Crear partida/i });
        fireEvent.click(submitButton);
    
        const errorMessage = screen.getByText('Todos los campos son obligatorios');
        expect(errorMessage).toBeInTheDocument();
    });
});
