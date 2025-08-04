import type { Reducer } from "@reduxjs/toolkit";
import gameSlice from "./slice";
import type { GameState } from "./types";

export default function gameReducer(
  state: GameState | undefined,
  action: any
): ReturnType<Reducer<GameState>> {
  return gameSlice.reducer(state, action);
}
