import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatComponent from '@components/chat';
import { GameInfoProvider } from '@/app/contexts/GameInfoContext';
import { ChatProvider } from '@/app/contexts/ChatContext';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

// Mock de `fetch`
global.fetch = jest.fn();

// Helper para envolver el componente con ambos proveedores
const renderWithContext = (ui: JSX.Element) => {
  return render(
    <GameInfoProvider>
      <ChatProvider>
        {ui}
      </ChatProvider>
    </GameInfoProvider>
  );
};

describe('ChatComponent', () => {
  beforeEach(() => {
    // Limpiar los mocks antes de cada test
    jest.clearAllMocks();
  });

  it('muestra los mensajes en el chat', () => {
    const messages = ["Hola", "_Acción ejecutada_"];
    renderWithContext(<ChatComponent messages={messages} />);

    // Verificar que los mensajes estén en pantalla
    expect(screen.getByText("Hola")).toBeInTheDocument();
    expect(screen.getByText("Acción ejecutada")).toHaveClass("text-purple-400 italic");
  });
});
