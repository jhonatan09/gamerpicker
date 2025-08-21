import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Game, GameState } from "./types";

const ramCache = new Map<string, string>();

const SPECS_API = String(import.meta.env.VITE_SPECS_API || "").replace(
  /\/$/,
  ""
);

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
            if (!SPECS_API) {
              ramCache.set(game.freetogame_profile_url, "N/A");
              return { ...game, min_ram: "N/A" };
            }

            const specsRes = await axios.get(`${SPECS_API}/specs`, {
              params: { url: game.freetogame_profile_url },
              validateStatus: (s) => (s >= 200 && s < 300) || s === 204,
              timeout: 20000,
            });

            if (specsRes.status === 204 || !specsRes.data) {
              ramCache.set(game.freetogame_profile_url, "N/A");
              return { ...game, min_ram: "N/A" };
            }

            const memoryStr =
              (Object.entries(specsRes.data).find(
                ([k]) => k.toLowerCase() === "memory"
              )?.[1] as string) || "";

            let min_ram = "N/A";
            if (memoryStr) {
              const ramMatch = memoryStr.match(/\d+/);
              if (ramMatch) {
                const value = parseInt(ramMatch[0], 10);
                if (/mb/i.test(memoryStr)) {
                  min_ram = Math.ceil(value / 1024).toString(); // MB -> GB
                } else {
                  min_ram = value.toString();
                }
              }
            }

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

      const minRamFilter = state.game.filters.ram;

      const filtered = enrichedGames.filter((game) => {
        const ramStr = game.min_ram;
        const ramNum = parseInt(ramStr.replace(/[^\d]/g, ""), 10);

        if (!ramStr || ramStr === "N/A" || isNaN(ramNum)) {
          return false;
        }

        const ramMatch = !minRamFilter || ramNum <= minRamFilter;

        const gameGenres = game.genre.split(",").map((g) => g.trim());
        const genreMatch =
          state.game.filters.genres.length === 0 ||
          state.game.filters.genres.some((genre) => gameGenres.includes(genre));

        const platformMatch =
          state.game.filters.platform === "ambos" ||
          game.platform
            .toLowerCase()
            .includes(state.game.filters.platform.toLowerCase());

        return ramMatch && genreMatch && platformMatch;
      });

      return filtered;
    } catch (error) {
      console.error("Erro ao buscar:", error);
      throw error;
    }
  }
);
