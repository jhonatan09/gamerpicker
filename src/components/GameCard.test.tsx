import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useParams } from "react-router-dom";

import GameCard from "./GameCard";
import { GAME_ALPHA as game } from "../utils/test/data.mocks";

function Probe() {
  const { id } = useParams();
  return <div data-testid="details-probe">Rota detalhes: {id}</div>;
}

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<GameCard game={game as any} />} />
        <Route path="/games/:id" element={<Probe />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("GameCard", () => {
  it("renderiza titulo, genero, descricao e imagem", () => {
    renderWithRouter();
    expect(
      screen.getByRole("heading", { name: game.title })
    ).toBeInTheDocument();
    expect(screen.getByText(game.genre)).toBeInTheDocument();

    expect(screen.getByText(game.short_description)).toBeInTheDocument();

    const img = screen.getByRole("img", {
      name: game.title,
    }) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(game.thumbnail);
    expect(img.alt).toBe(game.title);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe(`/games/${game.id}`);
  });

  it("ao clicar no link, navega para /games/:id", () => {
    renderWithRouter();

    const link = screen.getByRole("link");
    fireEvent.click(link);

    expect(screen.getByTestId("details-probe")).toHaveTextContent(
      `Rota detalhes: ${game.id}`
    );
  });
});
