import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GameFilters } from "./types";
import { initialGameState } from "./state";

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    setFilters(state, action: PayloadAction<GameFilters>) {
      state.filters = action.payload;
      state.page = 1;
      state.games = [];
      state.hasMore = true;
    },
  },
});

export const { setFilters } = gameSlice.actions;
export default gameSlice;
