import React from 'react';
import { render, screen } from '@testing-library/react'
import FormCrearPartida from '../components/formCreateGame';
import '@testing-library/jest-dom'


describe('FormCrearPartida', () => {
    test('should render the form', () => {
        render(<FormCrearPartida />);
        const inputGameName = screen.getByRole('input', {name: 'game_name'});
        const inputPlayerName = screen.getByRole('input', {name: 'player_name'});
        expect (inputGameName).toBeInTheDocument();
        expect (inputPlayerName).toBeInTheDocument();
    });

    test('should be required', () => {
        render(<FormCrearPartida />);
        const inputGameName = screen.getByRole('input', {name: 'game_name'});
        const inputPlayerName = screen.getByRole('input', {name: 'player_name'});
        expect(inputGameName).toBeRequired();
        expect(inputPlayerName).toBeRequired();
    });

    test('should show error message when fields are empty', () => {
        render(<FormCrearPartida />);
        const inputGameName = screen.getByRole('input', {name: 'game_name'});
        const inputPlayerName = screen.getByRole('input', {name: 'player_name'});
        const submitButton = screen.getByRole('button', { name: /Crear partida/i });
        fireEvent.click(submitButton);
    
        const errorMessage = screen.getByText('All fields are required');
        expect(errorMessage).toBeInTheDocument();
    });
});
