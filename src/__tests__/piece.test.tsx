import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Piece } from "@/components/piece";

describe("Piece Component", () => {
  const mockSetSelectedPiece = jest.fn();

  beforeEach(() => {
    mockSetSelectedPiece.mockClear();
  });

  it("renders with the correct color and class", () => {
    render(
      <Piece
        color={0}
        selected={false}
        index={0}
        setSelected={mockSetSelectedPiece}
      />
    );

    const pieceElement = screen.getByRole("piece");
    expect(pieceElement).toBeInTheDocument();
  });

  it("applies the selected styles when the piece is selected", () => {
    render(
      <Piece
        color={2}
        index={1}
        selected={false}
        setSelected={mockSetSelectedPiece}
      />
    );

    const pieceElement = screen.getByRole("piece");
    expect(pieceElement).toBeInTheDocument();

  });

  it("calls setSelectedPiece with the correct index when clicked", () => {
    render(
      <Piece color={0} selected={false} index={2} setSelected={mockSetSelectedPiece} />
    );

    const pieceElement = screen.getByTestId("piece-btn");
    fireEvent.click(pieceElement);

    // Verificar que setSelectedPiece se haya llamado con el índice correcto
    expect(mockSetSelectedPiece).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedPiece).toHaveBeenCalledWith(2);
  });
});
