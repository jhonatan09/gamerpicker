/// <reference types="vitest" />
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameGrid from "./GameGrid";

const mockGame = {
  id: 1,
  title: "Test Game",
  thumbnail: "https://example.com/thumb.jpg",
  short_description: "Test description",
  game_url: "https://example.com",
  genre: "Shooter",
  platform: "PC (Windows)",
  publisher: "Test Publisher",
  developer: "Test Dev",
  release_date: "2025-01-01",
  freetogame_url: "https://freetogame.com/game",
  freetogame_profile_url: "https://freetogame.com/game-profile",
  min_ram: "8 GB",
  minimum_system_requirements: {
    os: "Windows 10",
    processor: "Intel i5",
    memory: "8 GB RAM",
    graphics: "GTX 1050",
    storage: "30 GB",
  },
};

describe("GameGrid", () => {
  it("renders all games in the grid", () => {
    render(
      <MemoryRouter>
        <GameGrid
          games={[mockGame, { ...mockGame, id: 2, title: "Another Game" }]}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByText("Another Game")).toBeInTheDocument();
  });
});
