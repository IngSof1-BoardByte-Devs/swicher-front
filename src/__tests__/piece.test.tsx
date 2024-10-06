import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Piece } from "@/components/piece";

describe("Piece Component", () => {
  const mockSetSelectedPiece = jest.fn();

  it("renders with the correct color and class", () => {
    render(
      <Piece
        color={0}
        index={0}
        selectedPiece={-1}
        setSelectedPiece={mockSetSelectedPiece}
      />
    );

    const pieceElement = screen.getByRole("img");
    expect(pieceElement).toBeInTheDocument();
  });

  it("applies the selected styles when the piece is selected", () => {
    render(
      <Piece
        color={2}
        index={1}
        selectedPiece={1}
        setSelectedPiece={mockSetSelectedPiece}
      />
    );

    const pieceElement = screen.getByRole("img");
    expect(pieceElement).toBeInTheDocument();

  });

  it("calls setSelectedPiece with the correct index when clicked", () => {
    render(
      <Piece
        color={3} 
        index={2}
        selectedPiece={-1}
        setSelectedPiece={mockSetSelectedPiece}
      />
    );

    const pieceElement = screen.getByRole("img");
    fireEvent.click(pieceElement);

    // Verificar que setSelectedPiece se haya llamado con el índice correcto
    expect(mockSetSelectedPiece).toHaveBeenCalledWith(2);
    expect(mockSetSelectedPiece).toHaveBeenCalledTimes(1);
  });
});
