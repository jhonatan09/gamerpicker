import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, it, beforeEach, expect } from "vitest";
import axios from "axios";

import GameDetails from "./GameDetails";
import {
  GAME_ALPHA as mockGame,
  SPECS_ALPHA as mockSpecs,
} from "../utils/test/data.mocks";

vi.mock("axios");
const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderDetails(path = "/games/1") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/games/:id" element={<GameDetails />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("GameDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("renderiza detalhes do jogo e specs com sucesso", async () => {
    mockedAxios.get = vi
      .fn()
      .mockResolvedValueOnce({ data: [mockGame] })
      .mockResolvedValueOnce({ data: mockSpecs });

    renderDetails();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: mockGame.title })
      ).toBeInTheDocument();
    });

    const link = screen.getByRole("link", { name: /acessar página do jogo/i });
    expect(link).toHaveAttribute("href", mockGame.game_url);

    expect(screen.getByText(/Requisitos mínimos/i)).toBeInTheDocument();
    expect(screen.getByText(mockSpecs.os!)).toBeInTheDocument();
    expect(screen.getByText(mockSpecs.memory!)).toBeInTheDocument();
    expect(screen.getByText(mockSpecs.storage!)).toBeInTheDocument();
    expect(screen.getByText(mockSpecs.processor!)).toBeInTheDocument();
  });

  it("exibe erro e permite tentar novamente", async () => {
    mockedAxios.get = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce({ data: [mockGame] })
      .mockResolvedValueOnce({ data: mockSpecs });

    renderDetails();

    await waitFor(() => {
      expect(
        screen.getByText(/Ocorreu um erro ao carregar os dados do jogo/i)
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /tentar novamente/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: mockGame.title })
      ).toBeInTheDocument();
    });
  });

  it("botão Voltar navega para /", async () => {
    mockedAxios.get = vi
      .fn()
      .mockResolvedValueOnce({ data: [mockGame] })
      .mockResolvedValueOnce({ data: mockSpecs });

    renderDetails();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: mockGame.title })
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("favoritar e desfavoritar atualiza UI e localStorage", async () => {
    mockedAxios.get = vi
      .fn()
      .mockResolvedValueOnce({ data: [mockGame] })
      .mockResolvedValueOnce({ data: mockSpecs });

    renderDetails();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: mockGame.title })
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Adicionar aos favoritos/i })
    );
    expect(
      screen.getByRole("button", { name: /Remover dos favoritos/i })
    ).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("favorites") || "[]")).toContain(
      mockGame.id
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Remover dos favoritos/i })
    );
    expect(
      screen.getByRole("button", { name: /Adicionar aos favoritos/i })
    ).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("favorites") || "[]")).not.toContain(
      mockGame.id
    );
  });

  it("aplica tema escuro quando localStorage.theme = 'dark'", async () => {
    localStorage.setItem("theme", "dark");

    mockedAxios.get = vi
      .fn()
      .mockResolvedValueOnce({ data: [mockGame] })
      .mockResolvedValueOnce({ data: mockSpecs });

    renderDetails();

    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: mockGame.title })
      ).toBeInTheDocument();
    });
  });
});
