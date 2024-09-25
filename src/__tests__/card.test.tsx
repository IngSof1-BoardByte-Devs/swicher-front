import { Card } from "@/components/cards";
import { fetch_figure_cards, GetMoveCard } from "@/lib/card";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("fetch_figure_cards", () => {
  it("url should be correct with a POST request body", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ status: "OK" }));

    await fetch_figure_cards({ player_id: 1 });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/game/figure_cards",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_id: 1 }),
      }
    );
  });

  it("should throw an error when the server response is not successful", async () => {
    fetchMock.mockResponseOnce("", { status: 500 });

    const result = await fetch_figure_cards({ player_id: 1 });

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

    const result = await fetch_figure_cards({ player_id: 1 });

    expect(result).toEqual(mockResponse);
  });
});

describe("GetMoveCard", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  test('url should be correct', async () => {
    const result = await GetMoveCard({ player_id: 1 });
    console.log(result);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/movement-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: 1 }),
    });
  });

  test('should return success when the fetch request is successful', async () => {
    const mockResponse = { status: 'OK', message: 'Movement cards fetched successfully' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
    const result = await GetMoveCard({ player_id: 1 });
    expect(result).toEqual(mockResponse);
  });

  test('should return error when the fetch request fails', async () => {
    const mockResponse = { status: 'ERROR', message: 'An error occurred while getting the movement cards' };
    fetchMock.mockRejectOnce(new Error('Network error'));
    const result = await GetMoveCard({ player_id: 1 });
    expect(result).toEqual(mockResponse);
  });
});


describe('Card Component', () => {
  test('renders correctly', () => {
    render(<Card link="c0" />);
    const cardElement = screen.getByRole('img', { name: /c0/i });
    expect(cardElement).toBeInTheDocument();
  });

  test('has the correct alt text', () => {
    render(<Card link="c0" />);
    const cardElement = screen.getByRole('img', { name: /c0/i });
    expect(cardElement).toHaveAttribute('alt', 'c0');
  });

});