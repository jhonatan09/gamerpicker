import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Game } from "../store/game/types";

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [game, setGame] = useState<Game | null>(null);
  const [specs, setSpecs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(saved.includes(Number(id)));
  }, [id]);

  const toggleFavorite = () => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = saved.includes(Number(id))
      ? saved.filter((favId: number) => favId !== Number(id))
      : [...saved, Number(id)];
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(updated.includes(Number(id)));
  };

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get<Game[]>("/api/games");
      setGames(res.data);
      const foundGame = res.data.find((g) => g.id === Number(id));
      setGame(foundGame || null);

      if (foundGame) {
        const specsRes = await axios.get("http://localhost:3000/specs", {
          params: { url: foundGame.freetogame_profile_url },
        });
        setSpecs(specsRes.data);
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
            className="text-sm hover:underline"
          >
            ⬅ Voltar
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
            <p>
              🎮 <strong>Gênero:</strong> {game.genre}
            </p>
            <p>
              💻 <strong>Plataforma:</strong> {game.platform}
            </p>
            <p>
              🏢 <strong>Publisher:</strong> {game.publisher}
            </p>
            <p>
              👨‍💻 <strong>Developer:</strong> {game.developer}
            </p>
            <p>
              📅 <strong>Lançamento:</strong> {game.release_date}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <a
              href={game.game_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline text-sm"
            >
              Acessar página do jogo
            </a>
            <button
              onClick={toggleFavorite}
              className="text-yellow-400 text-sm"
            >
              ⭐{" "}
              {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            </button>
          </div>

          {specs && (
            <div className="bg-zinc-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">
                🛠️ Requisitos mínimos:
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
                  <p>
                    <strong>Idade recomendada:</strong>{" "}
                    {specs.additionalNotes || "-"}
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
