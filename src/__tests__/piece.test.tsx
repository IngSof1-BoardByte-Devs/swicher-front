import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Piece } from "@/components/piece";

describe("Piece Component", () => {
  const mockSetSelectedPiece = jest.fn();

  it("renders with the correct color and class", () => {
    render(
      <Piece
        color="red"
        index={0}
        selectedPiece={-1}
        setSelectedPiece={mockSetSelectedPiece}
      />
    );

    const pieceElement = screen.getByTestId("pieceElement");
    expect(pieceElement).toHaveTextContent("red");
    expect(pieceElement).toHaveClass("bg-red-700/75");
  });

  it("applies the selected styles when the piece is selected", () => {
    render(
      <Piece
        color="green"
        index={1}
        selectedPiece={1}
        setSelectedPiece={mockSetSelectedPiece}
      />
    );

    const pieceElement = screen.getByTestId("pieceElement");
    expect(pieceElement).toHaveClass("scale-90 brightness-150 animate-pulse");
  });

  it("calls setSelectedPiece with the correct index when clicked", () => {
    render(
      <Piece
        color="blue"
        index={2}
        selectedPiece={-1}
        setSelectedPiece={mockSetSelectedPiece}
      />
    );

    const pieceElement = screen.getByTestId("pieceElement");
    fireEvent.click(pieceElement);

    // Verificar que setSelectedPiece se haya llamado con el índice correcto
    expect(mockSetSelectedPiece).toHaveBeenCalledWith(2);
    expect(mockSetSelectedPiece).toHaveBeenCalledTimes(1);
  });
});
