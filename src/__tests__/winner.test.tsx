import React from 'react';
import { render, screen } from '@testing-library/react';
import { Winner } from '@components/winner';
import '@testing-library/jest-dom'

describe('Winner component', () => {
    test('should render the winner', () => {
        render(<Winner player_name="Player123" />);
        const winner = screen.getByText('Player123');
        expect(winner).toBeInTheDocument();
    });
});