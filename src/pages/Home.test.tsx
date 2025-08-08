import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { vi, describe, it, beforeEach, expect } from "vitest";
import axios from "axios";

import Home from "./Home";
import { store } from "../store";
import * as gameActions from "../store/game/actions";
import { GAMES } from "../utils/test/data.mocks";

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

vi.mock("axios");
const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };

vi.mock("../components/GameGrid", () => ({
  default: ({ games }: any) => (
    <div data-testid="game-grid">cards: {games?.length ?? 0}</div>
  ),
}));

function renderHome() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>
  );
}

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.get = vi.fn().mockResolvedValue({ data: GAMES });
  });

  it("monta a tela e chama fetchGames uma vez", async () => {
    const spy = vi.spyOn(gameActions, "fetchGames");

    renderHome();

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.getByRole("button", { name: /find game/i })
    ).toBeInTheDocument();
  });

  it("altera a plataforma para PC e dispara novo fetch", async () => {
    const spy = vi.spyOn(gameActions, "fetchGames");

    renderHome();

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByRole("button", { name: "PC" }));
    fireEvent.click(screen.getByRole("button", { name: /find game/i }));

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  it("preenche RAM minima e dispara novo fetch", async () => {
    const spy = vi.spyOn(gameActions, "fetchGames");

    renderHome();

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });

    const ramInput = screen.getByPlaceholderText(/minimum in gb/i);
    fireEvent.change(ramInput, { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: /find game/i }));

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
