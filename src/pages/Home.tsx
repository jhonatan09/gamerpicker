import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useCallback, useState } from "react";
import { fetchGames } from "../store/game/actions";
import { setFilters } from "../store/game/slice";
import type { RootState } from "../store";
import GameGrid from "../components/GameGrid";

export default function Home() {
  const dispatch = useDispatch();
  const { games, filters, loading, hasMore, error } = useSelector(
    (state: RootState) => state.game
  );

  const [formFilters, setFormFilters] = useState(() => ({
    genres: filters.genres.length ? filters.genres : ["Shooter"],
    platform: filters.platform || "ambos",
    ram: filters.ram || 0,
  }));

  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters(formFilters));
  };

  useEffect(() => {
    dispatch<any>(fetchGames());
  }, [filters]);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          dispatch<any>(fetchGames());
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, dispatch]
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#111] dark:text-white transition-colors duration-300 pt-24">
      <div className="min-h-screen bg-[#0c0c0c] text-white px-4 md:px-10 py-10">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          <div>
            <label className="block mb-2 text-sm font-semibold text-zinc-400">
              Genres
            </label>
            <div className="flex flex-wrap gap-2">
              {["MMORPG", "Shooter", "Strategy", "Racing", "Sports"].map(
                (genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() =>
                      handleChange(
                        "genres",
                        formFilters.genres.includes(genre)
                          ? formFilters.genres.filter((g) => g !== genre)
                          : [...formFilters.genres, genre]
                      )
                    }
                    className={`px-4 py-1 rounded-full text-sm transition border
                  ${
                    formFilters.genres.includes(genre)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-[#1a1a1a] text-zinc-300 border-zinc-600 hover:bg-[#2a2a2a]"
                  }`}
                  >
                    {genre}
                  </button>
                )
              )}
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-zinc-400">
              Platform
            </label>
            <div className="flex gap-2">
              {["ambos", "PC (Windows)", "Web Browser"].map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handleChange("platform", platform)}
                  className={`px-4 py-1 rounded-full text-sm transition border
        ${
          formFilters.platform === platform
            ? "bg-indigo-600 text-white border-indigo-600"
            : "bg-[#1a1a1a] text-zinc-300 border-zinc-600 hover:bg-[#2a2a2a]"
        }`}
                >
                  {platform === "ambos"
                    ? "Ambos"
                    : platform === "PC (Windows)"
                    ? "PC"
                    : "Web"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-zinc-400">
              RAM
            </label>
            <input
              type="number"
              min={0}
              placeholder="Minimum in GB"
              value={formFilters.ram || ""}
              onChange={(e) =>
                handleChange(
                  "ram",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-zinc-600 text-white rounded placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition"
            >
              FIND GAME
            </button>
          </div>
        </form>

        <div className="mt-12">
          {loading && games.length === 0 ? (
            <p className="text-center text-sm text-zinc-400">
              Loading games...
            </p>
          ) : games.length === 0 ? (
            <p className="text-center text-sm text-zinc-500">
              Nenhum jogo encontrado com os filtros selecionados.
            </p>
          ) : (
            <>
              <GameGrid games={games} />
              <div ref={loadMoreRef} className="h-8" />
              {loading && (
                <p className="text-center text-sm text-zinc-400 mt-4">
                  Carregando mais jogos...
                </p>
              )}
              {error && (
                <p className="text-center text-sm text-red-400 mt-4">
                  Erro: {error}
                </p>
              )}
              {!hasMore && !loading && (
                <p className="text-center text-sm text-zinc-500 mt-4">
                  Todos os jogos foram carregados.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
