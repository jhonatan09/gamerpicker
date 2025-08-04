/// <reference types="vitest" />
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameCard from "./GameCard";
import type { Game } from "../store/game/types";

describe("GameCard", () => {
  const mockGame: Game = {
    id: 1,
    title: "Test Game",
    thumbnail: "https://example.com/thumb.jpg",
    short_description: "Test description",
    genre: "Shooter",
    platform: "PC (Windows)",
    min_ram: "8 GB",
    game_url: "",
    publisher: "",
    developer: "",
    release_date: "",
    freetogame_url: "",
    freetogame_profile_url: "",
  };

  it("renders the game title and thumbnail", () => {
    render(
      <MemoryRouter>
        <GameCard game={mockGame} />
      </MemoryRouter>
    );
    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByAltText("Test Game")).toHaveAttribute(
      "src",
      mockGame.thumbnail
    );
  });

  it("shows genre and platform", () => {
    render(
      <MemoryRouter>
        <GameCard game={mockGame} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Shooter/i)).toBeInTheDocument();

    // Usa queryByText com fallback seguro
    const platformMatch = screen.queryByText(/PC/i);
    expect(platformMatch).toBeTruthy();
  });

  it("shows min_ram if available", () => {
    render(
      <MemoryRouter>
        <GameCard game={mockGame} />
      </MemoryRouter>
    );
    expect(screen.getByText(/8 GB/i)).toBeInTheDocument();
  });
});
