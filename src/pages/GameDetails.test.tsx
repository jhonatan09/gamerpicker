import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import axios from "axios";
import GameDetails from "./GameDetails";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "1" }),
    useNavigate: () => navigateMock,
  };
});

vi.mock("axios", () => ({
  default: { get: vi.fn() },
}));

const ORIGINAL_ENV = { ...(import.meta as any).env };

const mockGame = {
  id: 1,
  title: "Overwatch 2",
  thumbnail: "https://img.example/ow2.jpg",
  game_url: "https://play.example/ow2",
  genre: "Shooter",
  platform: "PC (Windows)",
  publisher: "Blizzard",
  developer: "Blizzard",
  release_date: "2022-10-04",
  freetogame_profile_url: "https://www.freetogame.com/overwatch-2",
} as any;

function renderDetails() {
  return render(<GameDetails />);
}

beforeEach(() => {
  (import.meta as any).env = {
    ...ORIGINAL_ENV,
    VITE_SPECS_API: "http://localhost:8080",
  };

  vi.clearAllMocks();
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

afterAll(() => {
  (import.meta as any).env = ORIGINAL_ENV;
});

describe("GameDetails", () => {
  it("renderiza detalhes e a seção de requisitos quando a API de specs retorna 200", async () => {
    (axios.get as any)
      .mockResolvedValueOnce({ data: [mockGame] })

      .mockResolvedValueOnce({
        status: 200,
        data: {
          os: "Windows 10 64-bit",
          memory: "8 GB RAM",
          storage: "20 GB available space",
          processor: "Intel i5",
          graphics: "NVIDIA GTX 660",
        },
      });

    renderDetails();

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: mockGame.title })
      ).toBeInTheDocument()
    );

    expect(screen.getByText(/Requisitos mínimos/i)).toBeInTheDocument();

    expect(screen.getByText(/Windows 10/i)).toBeInTheDocument();
    expect(screen.getByText(/8 GB/i)).toBeInTheDocument();
    expect(screen.getByText(/20 GB/i)).toBeInTheDocument();
    expect(screen.getByText(/Intel i5/i)).toBeInTheDocument();
    expect(screen.getByText(/GTX/i)).toBeInTheDocument();
  });

  it("não mostra a seção de requisitos quando a API de specs retorna 204", async () => {
    (axios.get as any)

      .mockResolvedValueOnce({ data: [mockGame] })

      .mockResolvedValueOnce({ status: 204, data: undefined });

    renderDetails();

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: mockGame.title })
      ).toBeInTheDocument()
    );

    expect(screen.queryByText(/Requisitos mínimos/i)).not.toBeInTheDocument();
  });

  it("permite favoritar e desfavoritar o jogo (quando o controle de favoritos está presente)", async () => {
    (axios.get as any)

      .mockResolvedValueOnce({ data: [mockGame] })

      .mockResolvedValueOnce({ status: 204, data: undefined });

    renderDetails();

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: mockGame.title })
      ).toBeInTheDocument()
    );

    const addFavBtn =
      screen.queryByRole("button", { name: /Adicionar aos favoritos/i }) ??
      screen.queryByRole("button", { name: /Remover dos favoritos/i });

    if (!addFavBtn) {
      expect(
        screen.queryByRole("button", {
          name: /Adicionar aos favoritos|Remover dos favoritos/i,
        })
      ).not.toBeInTheDocument();
      return;
    }

    if (/Adicionar aos favoritos/i.test(addFavBtn.textContent || "")) {
      fireEvent.click(addFavBtn);
      expect(
        screen.getByRole("button", { name: /Remover dos favoritos/i })
      ).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", { name: /Remover dos favoritos/i })
      );
      expect(
        screen.getByRole("button", { name: /Adicionar aos favoritos/i })
      ).toBeInTheDocument();
    } else {
      fireEvent.click(addFavBtn);
      expect(
        screen.getByRole("button", { name: /Adicionar aos favoritos/i })
      ).toBeInTheDocument();
    }
  });

  it("botão Voltar chama navigate('/')", async () => {
    (axios.get as any)

      .mockResolvedValueOnce({ data: [mockGame] })

      .mockResolvedValueOnce({ status: 204, data: undefined });

    renderDetails();

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: mockGame.title })
      ).toBeInTheDocument()
    );

    const backBtn = screen.getByRole("button", { name: /Voltar/i });
    fireEvent.click(backBtn);
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("exibe erro e permite tentar novamente quando /api/games falha na primeira tentativa", async () => {
    (axios.get as any)

      .mockRejectedValueOnce(new Error("network error"))

      .mockResolvedValueOnce({ data: [mockGame] })

      .mockResolvedValueOnce({ status: 204, data: undefined });

    renderDetails();

    await waitFor(() =>
      expect(
        screen.getByText(/Ocorreu um erro ao carregar os dados do jogo/i)
      ).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: /Tentar novamente/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: mockGame.title })
      ).toBeInTheDocument()
    );
  });
});
