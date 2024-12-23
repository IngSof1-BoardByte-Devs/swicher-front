import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Winner } from '@/components/winner';
import { GameInfoProvider } from '@/app/contexts/GameInfoContext';
import { WebSocketProvider, useWebSocket } from '@/app/contexts/WebSocketContext';
import { useRouter } from 'next/navigation';

// Mockear el hook useRouter y definir el mock de push
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mockear el useWebSocket
jest.mock('@/app/contexts/WebSocketContext', () => ({
    useWebSocket: jest.fn(),
    WebSocketProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>, 
}));

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <GameInfoProvider>
        <WebSocketProvider>
          {ui}
        </WebSocketProvider>
      </GameInfoProvider>
    );
};

describe('Winner component', () => {
    const pushMock = jest.fn();

    beforeEach(() => {
        // Resetear el mock antes de cada test
        pushMock.mockReset();

        // Configurar el mock de useRouter para devolver un objeto con push
        (useRouter as jest.Mock).mockReturnValue({
            push: pushMock,
        });

        // Mockear la implementación de useWebSocket
        (useWebSocket as jest.Mock).mockReturnValue({
            socket: { send: jest.fn() }
        });
    });

    test('should render the winner', () => {
        renderWithProviders(<Winner player_name="Player123" />);
        const winner = screen.getByText('Player123');
        expect(winner).toBeInTheDocument();
    });

    test('should navigate to home page on "Salir" button click', () => {
        renderWithProviders(<Winner player_name="Player123" />);
        
        const exitButton = screen.getByRole('button', { name: /Salir/i });
        fireEvent.click(exitButton);
        
        expect(pushMock).toHaveBeenCalledWith("/");
    });
});
