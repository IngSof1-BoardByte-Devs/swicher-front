import React from "react";
import { render } from "@testing-library/react";
import Piece from "@/components/piece";
import "@testing-library/jest-dom";

describe("Piece Component", () => {
  test("renders with the correct background color", () => {
    const { getByTestId } = render(<Piece color="red" />);

    const pieceElement = getByTestId("pieceElement");

    expect(pieceElement).toHaveStyle("background-color: red");
  });

  test("renders without crashing", () => {
    const { container } = render(<Piece color="blue" />);

    expect(container).toBeInTheDocument();
  });
});
