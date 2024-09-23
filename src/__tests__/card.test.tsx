import { fetch_figure_cards } from "@/lib/card";
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
