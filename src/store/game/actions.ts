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

      const gamesWithCache = games.filter((game) =>
        ramCache.has(game.freetogame_profile_url)
      );

      const gamesWithoutCache = games.filter(
        (game) => !ramCache.has(game.freetogame_profile_url)
      );

      const toScrape = gamesWithoutCache.slice(0, 10);
      const notScraped = gamesWithoutCache.slice(10);

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

            ramCache.set(game.freetogame_profile_url, min_ram);

            return { ...game, min_ram };
          } catch (e) {
            ramCache.set(game.freetogame_profile_url, "N/A");
            return { ...game, min_ram: "N/A" };
          }
        })
      );

      const enrichedGames = [
        ...gamesWithCache.map((game) => ({
          ...game,
          min_ram: ramCache.get(game.freetogame_profile_url) || "N/A",
        })),
        ...scrapedGames,
        ...notScraped.map((game) => ({ ...game, min_ram: "N/A" })),
      ];

      const filtered = enrichedGames.filter((game) => {
        const ramStr = game.min_ram;
        const ramNum = parseInt(ramStr.replace(/[^\d]/g, ""), 10);

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
      console.error(" Erro ao buscar jogos:", error);
      throw error;
    }
  }
);
