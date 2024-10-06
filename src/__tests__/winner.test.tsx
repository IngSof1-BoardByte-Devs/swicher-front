import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Winner } from '@/components/winner';
import { GameInfoProvider } from '@/app/contexts/GameInfoContext';
import { WebSocketProvider, useWebSocket } from '@/app/contexts/WebSocketContext';
import { useRouter } from 'next/navigation';

// Mockear el hook useRouter
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
    beforeEach(() => {
        (useRouter as jest.Mock).mockImplementation(() => ({
            push: jest.fn(),
        }));

        // Mockear la implementación de useWebSocket
        (useWebSocket as jest.Mock).mockReturnValue({
            socket: { send: jest.fn(),
              onmessage: jest.fn(), }
        });
    });

    test('should render the winner ', () => {
        renderWithProviders(<Winner player_name="Player123" />);
        const winner = screen.getByText('Player123');
        expect(winner).toBeInTheDocument();
    });
});
