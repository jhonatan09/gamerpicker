import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Game, GameState } from "./types";

const ramCache = new Map<string, string>();

export const fetchGames = createAsyncThunk(
  "game/fetchGames",
  async (_, { getState }) => {
    const state = getState() as { game: GameState };

    try {
      const res = await axios.get<Game[]>("/api/games");

      const games = res.data;

      // 1. Separar os jogos com e sem cache
      const gamesWithCache = games.filter((game) =>
        ramCache.has(game.freetogame_profile_url)
      );

      const gamesWithoutCache = games.filter(
        (game) => !ramCache.has(game.freetogame_profile_url)
      );

      // 2. Limitar scraping a no máximo 10 sem cache
      const toScrape = gamesWithoutCache.slice(0, 10);
      const notScraped = gamesWithoutCache.slice(10);

      // 3. Enriquecer com RAM apenas os 10 primeiros
      const scrapedGames = await Promise.all(
        toScrape.map(async (game) => {
          try {
            const specsRes = await axios.get("http://localhost:3000/specs", {
              params: { url: game.freetogame_profile_url },
            });

            const memoryStr =
              specsRes.data?.memory || specsRes.data?.Memory || "";
            const ramMatch = memoryStr.match(/\d+/);
            const min_ram = ramMatch ? ramMatch[0] : "N/A";

            console.log(`🧠 RAM extraída para ${game.title}: ${min_ram}`);
            ramCache.set(game.freetogame_profile_url, min_ram);

            return { ...game, min_ram };
          } catch (e) {
            console.warn(`⚠️ Falha ao extrair RAM para ${game.title}`);
            ramCache.set(game.freetogame_profile_url, "N/A");
            return { ...game, min_ram: "N/A" };
          }
        })
      );

      // 4. Montar lista final: com cache + raspados + ignorados
      const enrichedGames = [
        ...gamesWithCache.map((game) => ({
          ...game,
          min_ram: ramCache.get(game.freetogame_profile_url) || "N/A",
        })),
        ...scrapedGames,
        ...notScraped.map((game) => ({ ...game, min_ram: "N/A" })),
      ];

      // 5. Aplicar filtros
      const filtered = enrichedGames.filter((game) => {
        const ramStr = game.min_ram;
        const ramNum = parseInt(ramStr.replace(/[^\d]/g, ""), 10);

        // ✅ filtra fora jogos com RAM ausente ou "N/A"
        if (!ramStr || ramStr === "N/A" || isNaN(ramNum)) {
          return false;
        }

        const ramMatch =
          !state.game.filters.ram || ramNum >= state.game.filters.ram;

        const genreMatch =
          state.game.filters.genres.length === 0 ||
          state.game.filters.genres.includes(game.genre);
        const platformMatch =
          state.game.filters.platform === "ambos" ||
          game.platform
            .toLowerCase()
            .includes(state.game.filters.platform.toLowerCase());

        return ramMatch && genreMatch && platformMatch;
      });

      return filtered;
    } catch (error) {
      console.error("❌ Erro ao buscar jogos:", error);
      throw error;
    }
  }
);
