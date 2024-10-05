import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Winner } from '@/components/winner';
import { GameInfoProvider } from '@/app/contexts/GameInfoContext';
import { WebSocketProvider } from '@/app/contexts/WebSocketContext';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Winner component', () => {
    beforeEach(() => {
        // Mock the router object
        (useRouter as jest.Mock).mockImplementation(() => ({
            push: jest.fn(),
        }));
    });

    test('should render the winner and handle button click', () => {
        const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
            <GameInfoProvider>
                <WebSocketProvider>
                    {children}
                </WebSocketProvider>
            </GameInfoProvider>
        );

        render(
            <Wrapper>
                <Winner player_name="Player123" />
            </Wrapper>
        );

        const winner = screen.getByText('Player123');
        expect(winner).toBeInTheDocument();

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(useRouter().push).toHaveBeenCalledWith('/');
    });
});