/// <reference types="vitest" />
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import GameDetails from "./GameDetails";
import axios from "axios";
import { vi } from "vitest";
import mockGame from "../utils/game.mock";

vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

describe("GameDetails", () => {
  it("renders game details correctly", async () => {
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: [mockGame] });

    render(
      <MemoryRouter initialEntries={["/games/1"]}>
        <Routes>
          <Route path="/games/:id" element={<GameDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockGame.title)).toBeInTheDocument();
    });
  });
});
