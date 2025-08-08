import type { GameState } from "./types";

export const initialGameState: GameState = {
  games: [],
  filters: {
    genres: ["Shooter"],
    platform: "ambos",
    ram: 0,
  },
  loading: false,
  error: null,
  page: 0,
  hasMore: false,
};
