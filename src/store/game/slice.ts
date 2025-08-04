import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchGames } from "./actions";
import type { Game, GameFilters, GameState } from "./types";

const initialState: GameState = {
  games: [],
  filters: {
    genres: [],
    platform: "",
    ram: 0,
  },
  loading: false,
  error: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<GameFilters>) {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action: PayloadAction<Game[]>) => {
        state.loading = false;
        state.games = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao buscar jogos";
      });
  },
});

export const { setFilters } = gameSlice.actions;
export default gameSlice;
