import { fetch_board } from "@/lib/board";
import Gameboard from "@/components/gameboard";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import { useGameInfo } from "@/app/contexts/GameInfoContext";
import { Piece } from "@/components/piece";

fetchMock.enableMocks();
beforeEach(() => {
  fetchMock.resetMocks();
});

const id_game = 1;

describe("fetch_board", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("debe devolver el tablero correctamente cuando la respuesta es exitosa", async () => {
    const mockData = {
      board: [
        [0, 1],
        [1, 0],
      ],
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockData), { status: 200 });

    const result = await fetch_board({ id_game: 1 });

    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/games/1/board");
  });

  it("debe manejar errores y devolver un mensaje cuando la respuesta es un error", async () => {
    const errorMessage = "Game not found";
    fetchMock.mockResponseOnce(JSON.stringify({ detail: errorMessage }), {
      status: 404,
    });

    const result = await fetch_board({ id_game: 999 });

    expect(result).toEqual({
      status: "ERROR",
      message: errorMessage,
    });
    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/games/999/board");
  });

  it("debe manejar errores desconocidos y devolver un mensaje genérico", async () => {
    fetchMock.mockReject(new Error("Network error"));

    const result = await fetch_board({ id_game: 1 });

    expect(result).toEqual({
      status: "ERROR",
      message: "Network error",
    });
    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/games/1/board");
  });
});
