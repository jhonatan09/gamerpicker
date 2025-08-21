import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Game } from "../store/game/types";
import {
  FaArrowLeft,
  FaGamepad,
  FaLaptop,
  FaLaptopHouse,
  FaCalendar,
  FaCode,
  FaWrench,
} from "react-icons/fa";

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [, setGames] = useState<Game[]>([]);
  const [game, setGame] = useState<Game | null>(null);
  const [specs, setSpecs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [, setIsFavorite] = useState(false);

  const SPECS_API = String(import.meta.env.VITE_SPECS_API || "").replace(
    /\/$/,
    ""
  );

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(saved.includes(Number(id)));
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get<Game[]>("/api/games");
      setGames(res.data);
      const foundGame = res.data.find((g) => g.id === Number(id));
      setGame(foundGame || null);

      if (foundGame && SPECS_API) {
        const specsRes = await axios.get(`${SPECS_API}/specs`, {
          params: { url: foundGame.freetogame_profile_url },

          validateStatus: (s) => (s >= 200 && s < 300) || s === 204,
          timeout: 20000,
        });

        if (
          specsRes.status === 204 ||
          !specsRes.data ||
          !Object.keys(specsRes.data).length
        ) {
          setSpecs(null);
        } else {
          setSpecs(specsRes.data);
        }
      } else {
        setSpecs(null);
      }
    } catch (err) {
      console.error("Erro ao buscar detalhes do jogo:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-white max-w-4xl mx-auto animate-pulse space-y-4">
        <div className="h-8 w-1/3 bg-gray-700 rounded"></div>
        <div className="h-64 bg-gray-700 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
        <div className="h-32 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="p-6 text-white max-w-2xl mx-auto text-center">
        <p className="mb-4 text-red-400 font-semibold">
          Ocorreu um erro ao carregar os dados do jogo.
        </p>
        <button
          onClick={fetchData}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111] text-zinc-900 dark:text-white pt-24 px-4 md:px-8">
      <div className="p-6 text-white max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-zinc-900 dark:text-white hover:cursor-pointer"
            aria-label="Voltar"
            title="Voltar"
          >
            <FaArrowLeft className="h-6 w-6 text-blue-500" aria-hidden />
            <span>Voltar</span>
          </button>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-extrabold mb-4 text-center">
            {game.title}
          </h1>

          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full max-w-md mx-auto rounded mb-6"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-6">
            <p className="inline-flex items-center gap-2">
              <FaGamepad color="blue" size={20} />
              <strong>Gênero:</strong>
              <span>{game.genre}</span>
            </p>
            <p className="inline-flex items-center gap-2">
              <FaLaptop color="gray" size={20} />
              <strong>Plataforma:</strong>
              <span>{game.platform}</span>
            </p>

            <p className="inline-flex items-center gap-2">
              <FaLaptopHouse color="gray" size={20} />
              <strong>Publisher:</strong>
              <span>{game.publisher}</span>
            </p>

            <p className="inline-flex items-center gap-2">
              <FaCode color="gray" size={20} />
              <strong>Developer:</strong>
              <span>{game.developer}</span>
            </p>

            <p className="inline-flex items-center gap-2">
              <FaCalendar color="gray" size={20} />
              <strong>Lançamento:</strong>
              <span>{game.release_date}</span>
            </p>
          </div>

          {specs && (
            <div className="bg-zinc-800 rounded-lg p-4">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                <FaWrench className="h-6 w-6" aria-hidden />
                <span>Requisitos mínimos:</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Sistema Operacional:</strong> {specs.os}
                  </p>
                  <p>
                    <strong>Memória RAM:</strong> {specs.memory}
                  </p>
                  <p>
                    <strong>Armazenamento:</strong> {specs.storage}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Processador:</strong> {specs.processor}
                  </p>
                  <p>
                    <strong>Placa de Vídeo:</strong> {specs.graphics}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
