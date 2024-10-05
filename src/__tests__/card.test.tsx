import { Card } from "@/components/cards";
import { fetch_figure_cards, fetch_movement_cards } from "@/lib/card";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

const id_game = 1;
const id_player = 1;

describe("fetch_figure_cards", () => {
  it("url should be correct with a GET ", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: "OK" }));

    await fetch_figure_cards({ id_game});

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:8000/games/${id_game}/figure-cards`,
    );
  });

  it("should throw an error when the server response is not successful", async () => {
    fetchMock.mockResponseOnce("", { status: 500 });

    const result = await fetch_figure_cards({id_game });

    expect(result).toEqual({
      status: "ERROR",
      message: "An error occurred while fetching the figure cards",
    });
  });

  it("should return success when the fetch request is successful", async () => {
    const mockResponse = {
      status: "OK",
      message: "Figure cards fetched successfully",
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await fetch_figure_cards({ id_game });

    expect(result).toEqual(mockResponse);
  });
});

describe("GetMoveCard", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  test('url should be correct', async () => {
    const result = await fetch_movement_cards({ id_player});
    console.log(result);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8000/games/${id_player}/move-cards`);
  });

  test('should return success when the fetch request is successful', async () => {
    const mockResponse = { status: 'OK', message: 'Movement cards fetched successfully' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
    const result = await fetch_movement_cards({ id_player });
    expect(result).toEqual(mockResponse);
  });

  test('should return error when the fetch request fails', async () => {
    const mockResponse = { status: 'ERROR', message: 'An error occurred while getting the movement cards' };
    fetchMock.mockRejectOnce(new Error('Network error'));
    const result = await fetch_movement_cards({ id_player });
    expect(result).toEqual(mockResponse);
  });
});


describe('Card Component', () => {
  test('renders correctly', () => {
    render(<Card type={true} index={1} />);
    const cardElement = screen.getByRole('img', { name: /carta/i });
    expect(cardElement).toBeInTheDocument();
  });

  test('has the correct alt text', () => {
    render(<Card type={true} index={1} />);
    const cardElement = screen.getByRole('img', { name: /carta/i });
    expect(cardElement).toHaveAttribute('src', 'fig01');
  });

});
