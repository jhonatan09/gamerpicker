import { createReducer } from "@reduxjs/toolkit";
import { fetchGames } from "./actions";
import { setFilters } from "./slice";
import { initialGameState } from "./state";

const gameReducer = createReducer(initialGameState, (builder) => {
  builder
    .addCase(setFilters, (state, action) => {
      state.filters = action.payload;
      state.page = 1;
      state.games = [];
      state.hasMore = true;
    })
    .addCase(fetchGames.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchGames.fulfilled, (state, action) => {
      state.loading = false;

      const newGames = action.payload.filter(
        (newGame) =>
          !state.games.some((existingGame) => existingGame.id === newGame.id)
      );

      state.games = [...state.games, ...newGames];
      state.page += 1;
      state.hasMore = newGames.length > 0;
    })
    .addCase(fetchGames.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Erro ao buscar jogos";
    });
});

export default gameReducer;
