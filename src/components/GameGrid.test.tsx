import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import GameGrid from "./GameGrid";
import { GAMES_MINIMAL as games } from "../utils/test/data.mocks";

vi.mock("./GameCard", () => ({
  default: ({ game }: any) => <div data-testid="game-card">{game.title}</div>,
}));

describe("GameGrid", () => {
  it("renderiza um GameCard para cada item do array", () => {
    render(<GameGrid games={games as any} />);

    const cards = screen.getAllByTestId("game-card");
    expect(cards).toHaveLength(games.length);
  });

  it("Deixa a ordem dos jogos ao mapear", () => {
    render(<GameGrid games={games as any} />);

    const cards = screen.getAllByTestId("game-card");
    expect(cards[0]).toHaveTextContent("Alpha");
    expect(cards[1]).toHaveTextContent("Beta");
    expect(cards[2]).toHaveTextContent("Gamma");
  });

  it("usa container com classes de grid (layout responsivo)", () => {
    const { container } = render(<GameGrid games={games as any} />);
    const root = container.firstElementChild as HTMLElement;

    expect(root).toBeInTheDocument();
    expect(root.className).toContain("grid");
    expect(root.className).toContain("grid-cols-1");
    expect(root.className).toContain("sm:grid-cols-2");
    expect(root.className).toContain("md:grid-cols-3");
    expect(root.className).toContain("xl:grid-cols-4");
  });

  it("com array vazio, renderiza zero cards", () => {
    render(<GameGrid games={[]} />);

    const cards = screen.queryAllByTestId("game-card");
    expect(cards).toHaveLength(0);
  });
});
