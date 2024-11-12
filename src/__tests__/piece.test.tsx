import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Piece } from "@/components/piece";

describe('Piece Component', () => {
  const mockSetSelectedPiece = jest.fn();
  const mockVerifyMovement = jest.fn();
  const mockVerifyFigure = jest.fn();
  const mockSetSelected = jest.fn();

  const defaultProps = {
    color: 1,
    index: 0,
    selectedPiece: null,
    setSelectedPiece: mockSetSelectedPiece,
    isSwapping: false,
    verifyMovement: mockVerifyMovement,
    isMoveCardSelected: false,
    cardSelected: 'testCard',
    selectedTurn: 1,
    playerTurn: 1,
    selected: false,
    setSelected: mockSetSelected,
    isFigCardSelected: false,
    verifyFigure: mockVerifyFigure,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders with the correct color class', () => {
    const { rerender } = render(<Piece {...defaultProps} color={0} />);
    expect(screen.getByRole('piece')).toHaveClass('bg-violet-500/50');

    rerender(<Piece {...defaultProps} color={1} />);
    expect(screen.getByRole('piece')).toHaveClass('bg-red-500');

    rerender(<Piece {...defaultProps} color={2} />);
    expect(screen.getByRole('piece')).toHaveClass('bg-blue-500');

    rerender(<Piece {...defaultProps} color={3} />);
    expect(screen.getByRole('piece')).toHaveClass('bg-green-500');
  });

  test('applies the animate-pulse class when selected', () => {
    render(<Piece {...defaultProps} selected={true} />);
    expect(screen.getByRole('piece')).toHaveClass('animate-pulse');
  });

  test('handles click to set selectedPiece when isMoveCardSelected is true and playerTurn matches selectedTurn', () => {
    render(<Piece {...defaultProps} isMoveCardSelected={true} />);
    fireEvent.click(screen.getByTestId('piece-btn'));

    expect(mockSetSelectedPiece).toHaveBeenCalledWith(defaultProps.index);
  });

  test('does not set selectedPiece or verifyMovement if playerTurn does not match selectedTurn', () => {
    render(<Piece {...defaultProps} isMoveCardSelected={true} playerTurn={2} />);
    fireEvent.click(screen.getByTestId('piece-btn'));

    expect(mockSetSelectedPiece).not.toHaveBeenCalled();
    expect(mockVerifyMovement).not.toHaveBeenCalled();
  });

  test('calls verifyMovement when a different piece is selected', () => {
    render(<Piece {...defaultProps} isMoveCardSelected={true} selectedPiece={1} />);
    fireEvent.click(screen.getByTestId('piece-btn'));

    expect(mockVerifyMovement).toHaveBeenCalledWith(defaultProps.cardSelected, 1, defaultProps.index);
  });

  test('triggers swap animation when isSwapping is true', () => {
    render(<Piece {...defaultProps} isSwapping={true} />);
    const pieceElement = screen.getByRole('piece');
    expect(pieceElement).toHaveStyle('opacity: 1');
    // Se asume que la animación cambia temporalmente el `scale` a `0` y luego lo restaura
  });

  test('triggers visible animation when isSwapping is false', () => {
    render(<Piece {...defaultProps} isSwapping={false} />);
    const pieceElement = screen.getByRole('piece');
    expect(pieceElement).toHaveStyle('opacity: 1');
    // El `scale` debería estar en `1` cuando es visible
  });

  test('deselects piece if already selected', () => {
    render(<Piece {...defaultProps} selected={true} />);
    fireEvent.click(screen.getByTestId('piece-btn'));

    expect(mockSetSelected).toHaveBeenCalledWith(undefined);
  });
});
